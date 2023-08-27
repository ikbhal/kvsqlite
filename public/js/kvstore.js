// kvstore.js

class KVStore {
    constructor() {
      if (KVStore.instance) {
        return KVStore.instance;
      }
  
      this.baseURL = 'https://kvsqlite.rontohub.com';
      KVStore.instance = this;
    }
  
    async setKeyValue(key, value) {
      const url = `${this.baseURL}/set`;
      const data = { key, value };
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          throw new Error('Failed to set key-value pair');
        }
  
        const result = await response.json();
        return result;
      } catch (error) {
        throw new Error(`Failed to set key-value pair: ${error.message}`);
      }
    }
  
    async getKeyValue(key) {
      const url = `${this.baseURL}/get/${key}`;
  
      try {
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error('Failed to get value for key');
        }
  
        const result = await response.json();
        return result.value;
      } catch (error) {
        throw new Error(`Failed to get value for key: ${error.message}`);
      }
    }
  
    async deleteKey(key) {
      const url = `${this.baseURL}/delete/${key}`;
  
      try {
        const response = await fetch(url, { method: 'DELETE' });
  
        if (!response.ok) {
          throw new Error('Failed to delete key');
        }
  
        const result = await response.json();
        return result;
      } catch (error) {
        throw new Error(`Failed to delete key: ${error.message}`);
      }
    }
  
    // ... other methods ...
  
  }
  
  const kvStoreInstance = new KVStore();
//   export default kvStoreInstance;
  