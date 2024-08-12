const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

// 데이터베이스 연결을 위한 sequelize 인스턴스 생성
let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.subscriber = require("./subscriber.js")(sequelize, Sequelize);
db.tempSubscriber = require("./tempSubscriber.js")(sequelize, Sequelize);
db.machine = require("./machine.js")(sequelize, Sequelize);
db.reservation = require("./reservation.js")(sequelize, Sequelize);
db.notice = require("./notice.js")(sequelize, Sequelize);
db.review = require("./reviews.js")(sequelize, Sequelize);
db.branch = require("./branch.js")(sequelize, Sequelize);
db.favorites = require("./favorites.js")(sequelize, Sequelize);

// 모델 간의 관계 정의 (Associations)
db.branch.hasMany(db.review, { foreignKey: 'branchID', as: 'reviews' });
db.review.belongsTo(db.branch, { foreignKey: 'branchID', as: 'branch' });

db.machine.hasMany(db.reservation, { foreignKey: 'machineID', as: 'reservations' });
db.reservation.belongsTo(db.machine, { foreignKey: 'machineID', as: 'machine' });

db.machine.belongsTo(db.branch, { foreignKey: 'branchID', as: 'branch' });
db.branch.hasMany(db.machine, { foreignKey: 'branchID', as: 'machines' });

db.reservation.belongsTo(db.subscriber, { foreignKey: 'subscriberID', as: 'subscriber' });
db.subscriber.hasMany(db.reservation, { foreignKey: 'subscriberID', as: 'reservations' });

db.favorites.belongsTo(db.review, { foreignKey: 'reviewID', as: 'review' });

module.exports = db;
