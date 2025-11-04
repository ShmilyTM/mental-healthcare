const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema({
  appName: { type: String, default: "Mental HealthCare Platform" },
  supportEmail: { type: String, default: "support@mentalcare.com" },
  serviceFeePercent: { type: Number, default: 10 },
  maintenanceMode: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
