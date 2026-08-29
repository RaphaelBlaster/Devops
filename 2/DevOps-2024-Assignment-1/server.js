const express = require('express');
const mongoose = require('mongoose');

const port = Number(process.env.PORT) || 3000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/devops_assignment';
const app = express();

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' }
}, { timestamps: true });
const Item = mongoose.model('Item', itemSchema);

app.use(express.json());
app.use(express.static('public'));

app.get('/health', (request, response) => response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.get('/api/items', async (request, response) => { try { response.json(await Item.find().sort({ createdAt: -1 })); } catch (error) { response.status(500).json({ error: error.message }); } });
app.post('/api/items', async (request, response) => { try { const item = await Item.create(request.body); response.status(201).json(item); } catch (error) { response.status(400).json({ error: error.message }); } });
app.put('/api/items/:id', async (request, response) => { try { const item = await Item.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true }); if (!item) return response.status(404).json({ error: 'Item not found' }); response.json(item); } catch (error) { response.status(400).json({ error: error.message }); } });
app.delete('/api/items/:id', async (request, response) => { try { const item = await Item.findByIdAndDelete(request.params.id); if (!item) return response.status(404).json({ error: 'Item not found' }); response.status(204).end(); } catch (error) { response.status(400).json({ error: error.message }); } });

async function start() {
  await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
  app.listen(port, () => console.log(`DevOps assignment running at http://localhost:${port}`));
}
start().catch((error) => { console.error(`Startup failed: ${error.message}`); process.exit(1); });
