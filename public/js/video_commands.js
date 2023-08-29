class VideoCommands {
    constructor(kvStore) {
      this.kvStore = kvStore;
      this.videosKey = 'videos';
    }
  
    async handleCommand(command, args) {
      switch (command) {
        case 'add':
          return this.handleAddVideo(args);
        case 'list':
          return this.handleListVideos();
        case 'delete':
          return this.handleDeleteVideo(args);
        case 'play':
          return this.handlePlayVideo(args);
        case 'current':
          return this.handleCurrentVideo(args);
        case 'vn':
          return this.handleAddNotes(args);
        case 'help':
          return this.showHelp();
        default:
          return 'Unknown command.';
      }
    }
  
    showHelp() {
      const helpMessage = [
        '/video add <url> - Add a YouTube video to the list.',
        '/video list - Show the list of video links.',
        '/video delete <index> - Delete a video from the list.',
        '/video play <index> - Play the YouTube video at the specified index.',
        '/video current [<index>] - Show the current video or set a new current video.',
        '/vn <notes> - Add notes to the current video.',
        '/video help - Show this help message.'
      ].join('<br>');
      return helpMessage;
    }
  
    async handleAddVideo(args) {
      const [url] = args;
  
      // Validate input
      if (!url) {
        return 'Invalid input. Please provide a valid YouTube video URL.';
      }
  
      const videos = await this.kvStore.getKeyValue(this.videosKey) || [];
      videos.push({ url, notes: '' });
  
      await this.kvStore.setKeyValue(this.videosKey, JSON.stringify(videos));
      return 'Video added successfully.';
    }
  
    async handleListVideos() {
      const videos = await this.kvStore.getKeyValue(this.videosKey) || [];
      if (videos.length === 0) {
        return 'No videos available.';
      }
  
      const videosList = videos.map((video, index) => `${index + 1}. ${video.url}`);
      return videosList.join('\n');
    }
  
    async handleDeleteVideo(args) {
      const [indexStr] = args;
      const index = parseInt(indexStr) - 1;
  
      if (isNaN(index)) {
        return 'Invalid index.';
      }
  
      const videos = await this.kvStore.getKeyValue(this.videosKey) || [];
  
      if (index < 0 || index >= videos.length) {
        return 'Invalid index.';
      }
  
      videos.splice(index, 1);
      await this.kvStore.setKeyValue(this.videosKey, JSON.stringify(videos));
      return 'Video deleted successfully.';
    }
  
    async handlePlayVideo(args) {
      const [indexStr] = args;
      const index = parseInt(indexStr) - 1;
  
      if (isNaN(index)) {
        return 'Invalid index.';
      }
  
      const videos = await this.kvStore.getKeyValue(this.videosKey) || [];
  
      if (index < 0 || index >= videos.length) {
        return 'Invalid index.';
      }
  
      return `Playing video: ${videos[index].url}`;
    }
  
    async handleCurrentVideo(args) {
      const [indexStr] = args;
  
      if (indexStr) {
        const index = parseInt(indexStr) - 1;
  
        if (isNaN(index)) {
          return 'Invalid index.';
        }
  
        const videos = await this.kvStore.getKeyValue(this.videosKey) || [];
  
        if (index < 0 || index >= videos.length) {
          return 'Invalid index.';
        }
  
        await this.kvStore.setKeyValue('currentVideoIndex', index.toString());
        return `Current video set to: ${videos[index].url}`;
      } else {
        const currentVideoIndex = await this.kvStore.getKeyValue('currentVideoIndex');
        if (currentVideoIndex !== null) {
          const index = parseInt(currentVideoIndex);
          const videos = await this.kvStore.getKeyValue(this.videosKey) || [];
  
          if (index < 0 || index >= videos.length) {
            return 'Current video index is invalid.';
          }
  
          return `Current video: ${videos[index].url}`;
        } else {
          return 'No current video set.';
        }
      }
    }
  
    async handleAddNotes(args) {
      const [notes] = args;
  
      if (!notes) {
        return 'Invalid input. Please provide notes for the current video.';
      }
  
      const currentVideoIndex = await this.kvStore.getKeyValue('currentVideoIndex');
      if (currentVideoIndex !== null) {
        const index = parseInt(currentVideoIndex);
        const videos = await this.kvStore.getKeyValue(this.videosKey) || [];
  
        if (index < 0 || index >= videos.length) {
          return 'Current video index is invalid.';
        }
  
        videos[index].notes = notes;
        await this.kvStore.setKeyValue(this.videosKey, JSON.stringify(videos));
        return 'Notes added to the current video.';
      } else {
        return 'No current video set.';
      }
    }
  }
  
  // Instantiate the KVStore class
  
  // Instantiate the VideoCommands class with the KVStore instance
  const videoCommands = new VideoCommands(kvStoreInstance);
  