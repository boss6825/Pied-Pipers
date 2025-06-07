const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const path = require('path');

const dbFile = path.join(__dirname, 'queue.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

async function init() {
  await db.read();
  db.data ||= { queue: [] };
  await db.write();
}

async function enqueue(uuid, data) {
  await db.read();
  const item = {
    uuid,
    status: 'pending',
    data,
    createdAt: new Date().toISOString(),
  };
  db.data.queue.push(item);
  await db.write();
  return item.uuid;
}

async function dequeue() {
  await db.read();
  const item = db.data.queue.find((i) => i.status === 'pending');
  if (!item) return null;
  item.status = 'processing';
  item.attempts = (item.attempts || 0) + 1;
  await db.write();
  return item;
}

async function markSynced(uuid) {
  await db.read();
  db.data.queue = db.data.queue.filter((item) => item.uuid !== uuid);
  await db.write();
}

async function peek() {
  await db.read();
  return db.data.queue.find((i) => i.status === 'pending') || null;
}

async function length() {
  await db.read();
  return db.data.queue.length;
}

async function flush() {
  await db.read();
  db.data.queue = [];
  await db.write();
}

module.exports = {
  init,
  enqueue,
  dequeue,
  peek,
  markSynced,
  length,
  flush,
};
