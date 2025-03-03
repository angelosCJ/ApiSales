const locationSchema = new mongoose.Schema({
  city: String,
  region: String,
  country: String,
  latitude: Number,
  longitude: Number,
  deviceId: String,  // Store unique device ID
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', locationSchema);
