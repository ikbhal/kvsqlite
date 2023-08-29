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
  
    let videos;
    try {
      const videosJSON = await this.kvStore.getKeyValue(this.videosKey);
      videos = videosJSON ? JSON.parse(videosJSON) : [];
    } catch (error) {
      // Handle the case when the key is not found
      videos = [];
    }
  
    videos.push({ url, notes: '' });
  
    await this.kvStore.setKeyValue(this.videosKey, JSON.stringify(videos));
    return 'Video added successfully.';
  }
  

  async handleListVideos() {
    const videosJSON = await this.kvStore.getKeyValue(this.videosKey);
    
    if (!videosJSON) {
      return 'No videos available.';
    }
  
    const videos = JSON.parse(videosJSON);
  
    if (videos.length === 0) {
      return 'No videos available.';
    }
  
    let videosTable = '<table>';
    videosTable += '<tr><th>S.No</th><th>Video URL</th></tr>';
  
    for (let index = 0; index < videos.length; index++) {
      const video = videos[index];
      videosTable += `<tr><td>${index + 1}</td><td><a href="${video.url}" target="_blank">${video.url}</a></td></tr>`;
    }
  
    videosTable += '</table>';
  
    return videosTable;
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

    const videoUrl = videos[index].url;
    const embeddedUrl = this.getEmbeddedVideoUrl(videoUrl); // Call a helper function to get the embedded URL

    return `<iframe width="560" height="315" src="${embeddedUrl}" frameborder="0" allowfullscreen></iframe>`;
  }

  getEmbeddedVideoUrl(videoUrl) {
    // Extract the video ID from the YouTube URL
    const videoId = this.extractVideoId(videoUrl);

    // Construct the embedded YouTube URL
    const embeddedUrl = `https://www.youtube.com/embed/${videoId}`;

    return embeddedUrl;
  }

  extractVideoId(videoUrl) {
    // Use regex or other methods to extract the video ID from the YouTube URL
    // For example, if the video URL is "https://www.youtube.com/watch?v=VIDEO_ID"
    // you can extract "VIDEO_ID" from it
    const match = videoUrl.match(/v=([^&]+)/);
    if (match) {
      return match[1];
    } else {
      throw new Error('Invalid YouTube video URL.');
    }
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
