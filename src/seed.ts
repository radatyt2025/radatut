import { OpenAIEmbeddingFunction } from '@chroma-core/openai';
import { CloudClient } from 'chromadb';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '../.env' });

const embedder = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY as string,
  modelName: 'text-embedding-3-small',
});

const chroma = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY as string,
  tenant: 'c0349510-1bec-47fa-9702-a69c55003db8',
  database: 'radatut',
});

interface KnowledgeItem {
  title: string;
  topic: string;
  text: string;
  id: string;
}

async function seedDatabase() {
  try {
    const rawData = fs.readFileSync(
      '../public/student-council-knowledge-ua.json',
      'utf-8',
    );
    const knowledgeBase: KnowledgeItem[] = JSON.parse(rawData);

    const texts = knowledgeBase.map((item) => item.text);
    const ids = knowledgeBase.map(() => randomUUID());
    const metadatas = knowledgeBase.map((item) => ({
      title: item.title,
      topic: item.topic,
    }));

    const collection = await chroma.getOrCreateCollection({
      name: 'radatut-chat-bot',
      embeddingFunction: embedder,
    });

    await collection.add({
      ids,
      metadatas,
      documents: texts,
    });

    console.log('Successfully seeded ChromaDB collection!');
  } catch (error: unknown) {
    console.error(error);
  }
}

seedDatabase();
