import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'timers.json');

export const readFile = async () => {
  try {
    const data:any = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.writeFile(filePath, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

export const writeFile = async (data:any) => {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readFile, writeFile };
