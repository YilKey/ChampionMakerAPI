const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.type).delete();

    await knex(tables.type).insert([
      {
        typeName: "Mage",
        typeDiscription:
          "Mages are champions who typically possess great reach, ability-based area of effect damage and crowd control, and who use all of these strengths in tandem with each other to trap and destroy enemies from a distance",
      },
      {
        typeName: "Assasin",
        typeDiscription:
          "An Assassin is an agile champion that specializes in killing or disabling high value targets. Focused on infiltration, deception, and mobility, assassins are opportunistic hunters who find favorable moments within a fight before jumping into the fray.",
      },
      {
        typeName: "Tank",
        typeDiscription:
          "Tanks are durable, front-line champions that help lock down enemies and start fights. Many tanks can also protect their more fragile teammates by stunning or pushing around dangerous foes and limiting their damage potential.",
      },
      {
        typeName: "Healer",
        typeDiscription:
          "A healer is a character whose primary purpose or class role is to heal and protect their allies",
      },
      {
        typeName: "Fighter",
        typeDiscription:
          "Fighters are a diverse group of short-ranged combatants who excel at both dealing and surviving damage.",
      },
      {
        typeName: "Controller",
        typeDiscription:
          "Controllers assist their allies with potent utility and keep enemies at bay with crowd control.",
      },
      {
        typeName: "Marksman",
        typeDiscription:
          "A marksman is a ranged attacker that sacrifices defensive power and utility to focus on dealing strong, continuous damage to individual targets.",
      },
      {
        typeName: "Enchanter",
        typeDiscription:
          "Enchanters focus on amplifying their allies' effectiveness by directly augmenting them and defending them from incoming threats.",
      },
      {
        typeName: "Diver",
        typeDiscription:
          "Divers are the more mobile portion of the Fighter class. Divers excel at singling out high-priority targets to blitz toward, immediately forcing those targets (and their teammates) to deal with the diver's presence.",
      },
    ]);
  },
};
