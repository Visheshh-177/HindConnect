const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const JSON_DB_PATH = path.join(__dirname, 'database.json');
let useMongo = false;

// Simple Mongoose schema definitions
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Employee', 'IT Staff', 'Admin'], default: 'Employee' },
  department: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  mobile: { type: String },
  bloodGroup: { type: String },
  doj: { type: String },
  empCode: { type: String },
  designation: { type: String },
  emergencyContact: { type: String }
});

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'Pending', 'Resolved', 'Closed'], default: 'Open' },
  department: { type: String, required: true },
  employeeId: { type: String, required: true },
  assignedTo: { type: String, default: null },
  slaDeadline: { type: Date },
  attachments: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  message: { type: String, required: true },
  isInternal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const kbSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  views: { type: Number, default: 0 },
  helpfulVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const activityLogSchema = new mongoose.Schema({
  ticketId: { type: String },
  action: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// OTP verification schema — TTL index auto-deletes document after 5 minutes
const otpVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedOtp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now }
});
otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

let MongoUser, MongoTicket, MongoComment, MongoKb, MongoNotification, MongoActivityLog, MongoOtpVerification;

// Initialize JSON database if needed
const initJsonDb = () => {
  if (!fs.existsSync(JSON_DB_PATH)) {
    const initialData = {
      users: [],
      tickets: [],
      comments: [],
      knowledge_base: [],
      notifications: [],
      activity_logs: [],
      otp_verifications: []
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
  } else {
    // Ensure otp_verifications collection exists in legacy JSON DBs
    const db = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf8'));
    if (!db.otp_verifications) {
      db.otp_verifications = [];
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    }
  }
};

const readJsonDb = () => {
  try {
    initJsonDb();
    const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON DB, resetting file:', error);
    const initialData = {
      users: [],
      tickets: [],
      comments: [],
      knowledge_base: [],
      notifications: [],
      activity_logs: [],
      otp_verifications: []
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
};

const writeJsonDb = (data) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// JSON database collection wrapper to mimic Mongoose
class JsonModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async find(query = {}) {
    const db = readJsonDb();
    const items = db[this.collectionName] || [];
    return items.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    }).map(item => ({ ...item }));
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items.length > 0 ? items[0] : null;
  }

  async findById(id) {
    return this.findOne({ id });
  }

  async create(data) {
    const db = readJsonDb();
    if (!db[this.collectionName]) db[this.collectionName] = [];
    const newItem = {
      id: uuidv4(),
      _id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    db[this.collectionName].push(newItem);
    writeJsonDb(db);
    return { ...newItem };
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const db = readJsonDb();
    const items = db[this.collectionName] || [];
    const index = items.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    
    // Support Mongoose-like $push operators if needed, or simple merge
    const current = items[index];
    let updated = { ...current, ...updateData, updatedAt: new Date().toISOString() };
    
    items[index] = updated;
    writeJsonDb(db);
    return { ...updated };
  }

  async updateOne(query, updateData) {
    const db = readJsonDb();
    const items = db[this.collectionName] || [];
    const index = items.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index === -1) return { nModified: 0 };
    items[index] = { ...items[index], ...updateData, updatedAt: new Date().toISOString() };
    writeJsonDb(db);
    return { nModified: 1 };
  }

  async deleteMany(query = {}) {
    const db = readJsonDb();
    const items = db[this.collectionName] || [];
    const beforeCount = items.length;
    const remaining = items.filter(item => {
      for (let key in query) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });
    db[this.collectionName] = remaining;
    writeJsonDb(db);
    return { deletedCount: beforeCount - remaining.length };
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }

  // Upsert: update existing record matching query, or create new one
  async upsert(query, data) {
    const db = readJsonDb();
    const items = db[this.collectionName] || [];
    const index = items.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
      db[this.collectionName] = items;
      writeJsonDb(db);
      return { ...items[index] };
    } else {
      return this.create(data);
    }
  }

  async deleteOne(query = {}) {
    const db = readJsonDb();
    const items = db[this.collectionName] || [];
    const index = items.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index === -1) return { deletedCount: 0 };
    items.splice(index, 1);
    db[this.collectionName] = items;
    writeJsonDb(db);
    return { deletedCount: 1 };
  }
}

// Connect Function
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully');
      useMongo = true;

      MongoUser = mongoose.model('User', userSchema);
      MongoTicket = mongoose.model('Ticket', ticketSchema);
      MongoComment = mongoose.model('Comment', commentSchema);
      MongoKb = mongoose.model('KnowledgeBase', kbSchema);
      MongoNotification = mongoose.model('Notification', notificationSchema);
      MongoActivityLog = mongoose.model('ActivityLog', activityLogSchema);
      MongoOtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);
      return;
    } catch (error) {
      console.warn('MongoDB connection failed. Falling back to local JSON database.', error.message);
    }
  } else {
    console.log('No MONGO_URI specified. Using local JSON database fallback.');
  }
  
  useMongo = false;
  initJsonDb();
};

// Expose unified models
const getModel = (name, mongoModelFactory, jsonCollectionName) => {
  return {
    find: (query) => useMongo ? mongoModelFactory().find(query).lean() : new JsonModel(jsonCollectionName).find(query),
    findOne: (query) => useMongo ? mongoModelFactory().findOne(query).lean() : new JsonModel(jsonCollectionName).findOne(query),
    findById: (id) => useMongo ? mongoModelFactory().findById(id).lean() : new JsonModel(jsonCollectionName).findById(id),
    create: (data) => useMongo ? mongoModelFactory().create(data) : new JsonModel(jsonCollectionName).create(data),
    findByIdAndUpdate: (id, update, options) => useMongo 
      ? mongoModelFactory().findByIdAndUpdate(id, update, { new: true, ...options }).lean() 
      : new JsonModel(jsonCollectionName).findByIdAndUpdate(id, update, options),
    updateOne: (query, update) => useMongo 
      ? mongoModelFactory().updateOne(query, update) 
      : new JsonModel(jsonCollectionName).updateOne(query, update),
    deleteMany: (query) => useMongo 
      ? mongoModelFactory().deleteMany(query) 
      : new JsonModel(jsonCollectionName).deleteMany(query),
    countDocuments: (query) => useMongo 
      ? mongoModelFactory().countDocuments(query) 
      : new JsonModel(jsonCollectionName).countDocuments(query),
    isMongo: () => useMongo
  };
};

// Extended model factory for OtpVerification (needs upsert + deleteOne)
const getOtpModel = () => ({
  findOne: (query) => useMongo
    ? MongoOtpVerification.findOne(query).lean()
    : new JsonModel('otp_verifications').findOne(query),
  upsert: async (query, data) => {
    if (useMongo) {
      return MongoOtpVerification.findOneAndUpdate(query, { $set: data }, { upsert: true, new: true }).lean();
    }
    return new JsonModel('otp_verifications').upsert(query, data);
  },
  updateOne: (query, update) => useMongo
    ? MongoOtpVerification.updateOne(query, update)
    : new JsonModel('otp_verifications').updateOne(query, update),
  deleteOne: (query) => useMongo
    ? MongoOtpVerification.deleteOne(query)
    : new JsonModel('otp_verifications').deleteOne(query),
});

module.exports = {
  connectDB,
  User: getModel('User', () => MongoUser, 'users'),
  Ticket: getModel('Ticket', () => MongoTicket, 'tickets'),
  Comment: getModel('Comment', () => MongoComment, 'comments'),
  KnowledgeBase: getModel('KnowledgeBase', () => MongoKb, 'knowledge_base'),
  Notification: getModel('Notification', () => MongoNotification, 'notifications'),
  ActivityLog: getModel('ActivityLog', () => MongoActivityLog, 'activity_logs'),
  OtpVerification: getOtpModel()
};
