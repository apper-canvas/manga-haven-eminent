import mangaData from '../mockData/manga.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MangaService {
  constructor() {
    this.data = [...mangaData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(manga => manga.id === id);
    return item ? { ...item } : null;
  }

  async create(manga) {
    await delay(400);
    const newManga = {
      ...manga,
      id: Date.now().toString()
    };
    this.data.push(newManga);
    return { ...newManga };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(manga => manga.id === id);
    if (index === -1) throw new Error('Manga not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(manga => manga.id === id);
    if (index === -1) throw new Error('Manga not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async search(query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return this.data.filter(manga =>
      manga.title.toLowerCase().includes(lowerQuery) ||
      manga.author.toLowerCase().includes(lowerQuery) ||
      manga.series.toLowerCase().includes(lowerQuery) ||
      manga.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
    ).map(manga => ({ ...manga }));
  }

  async getByGenre(genre) {
    await delay(200);
    return this.data.filter(manga =>
      manga.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    ).map(manga => ({ ...manga }));
  }
}

export default new MangaService();