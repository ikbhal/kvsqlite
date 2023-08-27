

const quranSurahAyatsArray = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54,
  53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49,
  62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11,
  18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56,
  40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22,
  17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19,
  5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6
];
class QuranBookmarkCommands {
  constructor(kvStore) {
    this.kvStore = kvStore;
  }

  handleCommand(command, args) {
    switch (command) {
      case 'start':
        return this.handleStartBookmark();
      case 'status':
        return this.handleStatusBookmark();
      case 'reset':
        return this.handleResetBookmark();
      case 'next':
        return this.handleNextBookmark();
      case 'help':
        return this.showHelp();
      default:
        return 'Unknown command.';
    }
  }

  showHelp() {
    const helpMessage = [
      '/quran start - Start reading the Quran from a specific bookmarked ayah.',
      '/quran status - Show the current bookmarked position.',
      '/quran reset - Reset the bookmark to the beginning.',
      '/quran next - Move to the next bookmarked ayah.',
      '/quran help - Show this help message.'
    ].join('<br>');

    return helpMessage;
  }

  async handleStartBookmark() {
    try {
      const defaultValue = { surah: 1, ayat: 1 };
      await this.kvStore.setKeyValue('quranBookmark', JSON.stringify(defaultValue));
      const quranUrl = `https://quran.com/${defaultValue.surah}/${defaultValue.ayat}`;
      return `Quran bookmark position set to default. <br/> <a href="${quranUrl}" target="_blank">Open in Quran.com</a><br/>`;
    } catch (error) {
      return `Failed to set Quran bookmark: ${error.message}`;
    }
  }


  async handleStatusBookmark() {
    try {
      const bookmark = await this.kvStore.getKeyValue('quranBookmark');
      if (bookmark) {
        const { surah, ayat } = JSON.parse(bookmark);
        const quranLink = `https://quran.com/${surah}/${ayat}`;
        return `Current bookmarked position: Surah ${surah}, Ayat ${ayat}. [${quranLink}] <br/><a href="${quranLink}" target="_blank">Open in Quran.com</a><br/>`;
      } else {
        return 'No Quran bookmark found.';
      }
    } catch (error) {
      return `Failed to retrieve Quran bookmark: ${error.message}`;
    }
  }

  async handleResetBookmark() {
    try {
      await this.kvStore.deleteKey('quranBookmark');
      return 'Quran bookmark reset.';
    } catch (error) {
      return `Failed to reset Quran bookmark: ${error.message}`;
    }
  }

  async handleNextBookmark() {
    try {
      const bookmark = await this.kvStore.getKeyValue('quranBookmark');
      if (bookmark) {
        const { surah, ayat } = JSON.parse(bookmark);
        const totalAyats = quranSurahAyatsArray[surah - 1];
        if (ayat < totalAyats) {
          const newBookmark = JSON.stringify({ surah, ayat: ayat + 1 });
          await this.kvStore.setKeyValue('quranBookmark', newBookmark);
          const quranLink = `https://quran.com/${surah}/${ayat + 1}`;
          return `Moved to next bookmarked ayah: Surah ${surah}, Ayat ${ayat + 1}. [${quranLink}] <br/><a href="${quranLink}" target="_blank">Open in Quran.com</a><br/>`;
        } else {
          return 'You have reached the end of the bookmarked surah.';
        }
      } else {
        return 'No Quran bookmark found. Use /quran start to set a new bookmark.';
      }
    } catch (error) {
      return `Failed to update Quran bookmark: ${error.message}`;
    }
  }
}

// Instantiate the QuranBookmarkCommands class with the kvStoreInstance
const quranBookmarkCommands = new QuranBookmarkCommands(kvStoreInstance);
