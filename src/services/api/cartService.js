const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CartService {
  constructor() {
    this.data = [];
    this.nextId = 1;
  }

  async getAll() {
    await delay(250);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(cartItem => cartItem.id === id);
    return item ? { ...item } : null;
  }

  async create(cartItem) {
    await delay(300);
    
    // Check if item already exists in cart
    const existingIndex = this.data.findIndex(item => item.mangaId === cartItem.mangaId);
    
    if (existingIndex !== -1) {
      // Update quantity if item exists
      this.data[existingIndex].quantity += cartItem.quantity;
      return { ...this.data[existingIndex] };
    } else {
      // Add new item
      const newItem = {
        ...cartItem,
        id: this.nextId.toString()
      };
      this.nextId++;
      this.data.push(newItem);
      return { ...newItem };
    }
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Cart item not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Cart item not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async clear() {
    await delay(200);
    const cleared = [...this.data];
    this.data = [];
    return cleared;
  }

  async getTotal() {
    await delay(100);
    return this.data.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  async getItemCount() {
    await delay(100);
    return this.data.reduce((count, item) => count + item.quantity, 0);
  }
}

export default new CartService();