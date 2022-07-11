const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.champion).delete();

    await knex(tables.champion).insert([
      {
        championName: "LeBlanc",
        championDiscription:
          "Mysterious even to other members of the Black Rose cabal, LeBlanc is but one of many names for a pale woman who has manipulated people and events since the earliest days of Noxus. Using her magic to mirror herself, the sorceress can appear to anyone, anywhere, and even be in many places at once. Always plotting just out of sight, LeBlanc's true motives are as inscrutable as her shifting identity.",
        championType: "Assasin",
        fromUser: "Kerem",
        championRating: 0,
      },
      {
        championName: "Anivia",
        championDiscription:
          "Anivia is a benevolent winged spirit who endures endless cycles of life, death, and rebirth to protect the Freljord. A demigod born of unforgiving ice and bitter winds, she wields those elemental powers to thwart any who dare disturb her homeland. Anivia guides and protects the tribes of the harsh north, who revere her as a symbol of hope, and a portent of great change. She fights with every ounce of her being, knowing that through her sacrifice, her memory will endure, and she will be reborn into a new tomorrow.",
        championType: "Mage",
        fromUser: "Efe",
        championRating: 15,
      },
      {
        championName: "Ryze",
        championDiscription:
          "Widely considered one of the most adept sorcerers on Runeterra, Ryze is an ancient, hard-bitten archmage with an impossibly heavy burden to bear. Armed with immense arcane power and a boundless constitution, he tirelessly hunts for World Runes—fragments of the raw magic that once shaped the world from nothingness. He must retrieve these artifacts before they fall into the wrong hands, for Ryze understands the horrors they could unleash on Runeterra.",
        championType: "Mage",
        fromUser: "Berfin",
        championRating: 3,
      },
      {
        championName: "Zed",
        championDiscription:
          "Utterly ruthless and without mercy, Zed is the leader of the Order of Shadow, an organization he created with the intent of militarizing Ionia's magical and martial traditions to drive out Noxian invaders. During the war, desperation led him to unlock the secret shadow form—a malevolent spirit magic as dangerous and corrupting as it is powerful. Zed has mastered all of these forbidden techniques to destroy anything he sees as a threat to his nation, or his new order.",
        championType: "Assasin",
        fromUser: "Berfin",
        championRating: 1654,
      },
      {
        championName: "Jarvan IV",
        championDiscription:
          "Prince Jarvan, scion of the Lightshield dynasty, is heir apparent to the throne of Demacia. Raised to be a paragon of his nation's greatest virtues, he is forced to balance the heavy expectations placed upon him with his own desire to fight on the front lines. Jarvan inspires his troops with his fearsome courage and selfless determination, raising his family's colors high and revealing his true strength as a future leader of his people.",
        championType: "Diver",
        fromUser: "Efe",
        championRating: 159,
      },
      {
        championName: "Nami",
        championDiscription:
          "A headstrong young vastaya of the seas, Nami was the first of the Marai tribe to leave the waves and venture onto dry land, when their ancient accord with the Targonians was broken. With no other option, she took it upon herself to complete the sacred ritual that would ensure the safety of her people. Amidst the chaos of this new age, Nami faces an uncertain future with grit and determination, using her Tidecaller staff to summon the strength of the oceans themselves.",
        championType: "Enchanter",
        fromUser: "Kerem",
        championRating: 34,
      },
      {
        championName: "Gnar",
        championDiscription:
          "Gnar is a primeval yordle whose playful antics can erupt into a toddler's outrage in an instant, transforming him into a massive beast bent on destruction. Frozen in True Ice for millennia, the curious creature broke free and now hops about a changed world he sees as exotic and wondrous. Delighted by danger, Gnar flings whatever he can at his enemies, be it his bonetooth boomerang, or a nearby building.",
        championType: "Fighter",
        fromUser: "Sultan",
        championRating: 24,
      },
      {
        championName: "Kaisa",
        championDiscription:
          "Claimed by the Void when she was only a child, Kai'Sa managed to survive through sheer tenacity and strength of will. Her experiences have made her a deadly hunter and, to some, the harbinger of a future they would rather not live to see. Having entered into an uneasy symbiosis with a living Void carapace, the time will soon come when she must decide whether to forgive those mortals who would call her a monster, and defeat the coming darkness together… or simply to forget, as the Void consumes the world that left her behind.",
        championType: "Marksman",
        fromUser: "Sultan",
        championRating: 288,
      },
      {
        championName: "Thresh",
        championDiscription:
          "Sadistic and cunning, Thresh is an ambitious and restless spirit of the Shadow Isles. Once the custodian of countless arcane secrets, he was undone by a power greater than life or death, and now sustains himself by tormenting and breaking others with slow, excruciating inventiveness. His victims suffer far beyond their brief mortal coil as Thresh wreaks agony upon their souls, imprisoning them in his unholy lantern to torture for all eternity.",
        championType: "Controller",
        fromUser: "Kerem",
        championRating: 99,
      },
      {
        championName: "Soraka",
        championDiscription:
          "A wanderer from the celestial dimensions beyond Mount Targon, Soraka gave up her immortality to protect the mortal races from their own more violent instincts. She endeavors to spread the virtues of compassion and mercy to everyone she meets—even healing those who would wish harm upon her. And, for all Soraka has seen of this world's struggles, she still believes the people of Runeterra have yet to reach their full potential.",
        championType: "Healer",
        fromUser: "Berfin",
        championRating: 909,
      },
    ]);
  },
};
