const roles = () => {
  return [
    {
      id: 'merlin',
      side: 'good',
      text: 'Merlin',
      image: require('../assets/goods/merlin.png'),
      required: true,
    },
    {
      id: 'percival',
      side: 'good',
      text: 'Percival',
      image: require('../assets/goods/percival.png'),
    },
    {
      id: 'loyal1',
      side: 'good',
      text: 'Richard',
      image: require('../assets/goods/loyal1.png'),
    },
    {
      id: 'loyal2',
      side: 'good',
      text: 'Mattheus',
      image: require('../assets/goods/loyal2.png'),
    },
    {
      id: 'loyal3',
      side: 'good',
      text: 'Christian',
      image: require('../assets/goods/loyal3.png'),
    },
    {
      id: 'loyal4',
      side: 'good',
      text: 'David',
      image: require('../assets/goods/loyal4.png'),
    },
    {
      id: 'loyal5',
      side: 'good',
      text: 'Maria',
      image: require('../assets/goods/loyal5.png'),
    },
    {
      id: 'assassin',
      side: 'evil',
      text: 'Assassin',
      image: require('../assets/evils/assassin.png'),
      required: true,
    },
    {
      id: 'morgana',
      side: 'evil',
      text: 'Morgana',
      image: require('../assets/evils/morgana.png'),
    },
    {
      id: 'mordred',
      side: 'evil',
      text: 'Mordred',
      image: require('../assets/evils/mordred.png'),
    },
    {
      id: 'oberon',
      side: 'evil',
      text: 'Oberon',
      image: require('../assets/evils/oberon.png'),
    },
    {
      id: 'minion1',
      side: 'evil',
      text: 'Minion',
      image: require('../assets/evils/minion1.png'),
    },
    {
      id: 'minion2',
      side: 'evil',
      text: 'Minion',
      image: require('../assets/evils/minion2.png'),
    },
    {
      id: 'minion3',
      side: 'evil',
      text: 'Minion',
      image: require('../assets/evils/minion3.png'),
    },
  ];
};

export default roles();
