const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  constructor() {
    this.data = [];
    this.nextId = 1000;
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const order = this.data.find(order => order.id === id);
    return order ? { ...order } : null;
  }

  async create(orderData) {
    await delay(500); // Simulate payment processing time
    
    const newOrder = {
      ...orderData,
      id: this.nextId.toString(),
      orderNumber: `MH-${this.nextId}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    this.nextId++;
    this.data.push(newOrder);
    return { ...newOrder };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(order => order.id === id);
    if (index === -1) throw new Error('Order not found');
    
    this.data[index] = { 
      ...this.data[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(order => order.id === id);
    if (index === -1) throw new Error('Order not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByStatus(status) {
    await delay(200);
    return this.data.filter(order => order.status === status)
      .map(order => ({ ...order }));
  }

  async getByEmail(email) {
    await delay(200);
    return this.data.filter(order => 
      order.billing.email.toLowerCase() === email.toLowerCase()
    ).map(order => ({ ...order }));
  }
}

export default new OrderService();