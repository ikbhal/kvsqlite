

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


class QuranCommands {
  constructor() {
    this.surah = 1;
    this.ayat = 1;
  }

  handleCommand(command, args) {
    switch (command) {
      case 'start':
        return this.handleStartQuran(args);
      case 'status':
        return this.handleStatusQuran();
      case 'reset':
        return this.handleResetQuran();
      case 'next':
        return this.handleNextQuran();
      default:
        return 'Unknown command.';
    }
  }

  handleStartQuran(args) {
    this.surah = 1;
    this.ayat = 1;
    const quranUrl = `https://quran.com/${this.surah}/${this.ayatayat}`;
    return `Quran starting position set. <br/> <a href="${quranUrl}" target="_blank">Open in Quran.com</a><br/>`;
  }

  handleStatusQuran() {
    // const value = this.kvstore.get('quran');
    // if (value) {
      // const { surah, ayat } = JSON.parse(value);
      const quranLink = `https://quran.com/${this.surah}/${this.ayat}`;
      return `Current position: Surah ${this.surah}, Ayat ${this.ayat}. [${quranLink}] <br/><a href="${quranUrl}" target="_blank">Open in Quran.com</a><br/>`;
    // } else {
    //   return 'No Quran position set.';
    // }
  }

  handleResetQuran() {
    // const value = { surah: 1, ayat: 1 };
    // this.kvstore.set('quran', JSON.stringify(value));
    this.surah = 1; 
    this.ayat = 1;
    return 'Quran position reset to Surah 1, Ayat 1.';
  }

  handleNextQuran() {
    // const { surah, ayat } = JSON.parse(value);
    const totalAyats = quranSurahAyatsArray[this.surah - 1];

    if (this.ayat < totalAyats) {
      this.ayat++;
      // this.kvstore.set('quran', JSON.stringify({ surah, ayat: ayat + 1 }));
    } else if (this.ayat >= quranSurahAyatsArray.length) {
      this.surah ++;
      this.ayat=1;
      if(this.surah >= quranSurahAyatsArray.length){
        this.surah =1;
      }
      // this.kvstore.set('quran', JSON.stringify({ surah: surah + 1, ayat: 1 }));
    } else {
      return 'You have reached the end of the Quran.';
    }

    const quranLink = `https://quran.com/${this.surah}/${this.ayat}`;
    return `Moved to next ayat: Surah ${this.surah}, Ayat ${this.ayat}. [${quranLink}]`;
  }
}

// Instantiate the QuranCommands class with your kvstore instance
const quranCommands = new QuranCommands();
