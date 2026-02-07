import { ImageRequireSource } from 'react-native';

export const getImageSource = (imageName: string): ImageRequireSource => {
  const imageMap: { [key: string]: any } = {
    'GoEarth Bilona Ghee (1 Litre).jpg': require('../images/Organic/GoEarth Bilona Ghee (1 Litre).jpg'),
    'Go Earth Premium Organic Brown Sugar.jpg': require('../images/Organic/Go Earth Premium Organic Brown Sugar.jpg'),
    'Healthy Organic Jaggery.jpg': require('../images/Organic/Healthy Organic Jaggery.jpg'),
    'Besan-Gram Flour.jpg': require('../images/Organic/Besan-Gram Flour.jpg'),
    'Black CTC Tea.jpg': require('../images/Organic/Black CTC Tea.jpg'),
    'Amla Candy Sweet.jpg': require('../images/Organic/Amla Candy Sweet.jpg'),
    'Go Earth Organic Groundnut Seed.jpg': require('../images/Organic/Go Earth Organic Groundnut Seed.jpg'),
    'Hyper Nature Neem bathing Bar.jpg': require('../images/Organic/Hyper Nature Neem bathing Bar.jpg'),
    'Aloevera Bar (by Hyper Nature).jpg': require('../images/Organic/Aloevera Bar (by Hyper Nature).jpg'),
    'Hyper Nature Classic Ubtan Soap(100g).jpg': require('../images/Organic/Hyper Nature Classic Ubtan Soap(100g).jpg'),
    'Hyper Nature Charcoal Bar.jpg': require('../images/Organic/Hyper Nature Charcoal Bar.jpg'),
    'Hyper Nature Premium Bridal Beauty Bar.jpg': require('../images/Organic/Hyper Nature Premium Bridal Beauty Bar.jpg'),
    'De-Tan Bar (by Hyper Nature).jpg': require('../images/Organic/De-Tan Bar (by Hyper Nature).jpg'),
    'Glow Facial Bar.jpg': require('../images/Organic/Glow Facial Bar.jpg'),
    'Hyper Nature Skin Brightening Bar (100g).jpg': require('../images/Organic/Hyper Nature Skin Brightening Bar (100g).jpg'),
    'Hyper Nature Fenugreek Anti-Dandruff Shampoo.jpg': require('../images/Organic/Hyper Nature Fenugreek Anti-Dandruff Shampoo.jpg'),
    'Hyper Nature Nourishing Herbal Shampoo Bar.jpg': require('../images/Organic/Hyper Nature Nourishing Herbal Shampoo Bar.jpg'),
    'Bridal Beauty Bar.jpg': require('../images/Organic/Bridal Beauty Bar.jpg'),

    // No-Preservative images
    'Mix Millet Fusilli-Front.png': require('../images/No-Preservative/Mix Millet Fusilli-Front.png'),
    'Mix Millet Macaroni.png': require('../images/No-Preservative/Mix Millet Macaroni.png'),
    'Mix Millet Noodles.png': require('../images/No-Preservative/Mix Millet Noodles.png'),
    'Mix Millet Penne.png': require('../images/No-Preservative/Mix Millet Penne.png'),
    'Mix Millet Vermicelli.png': require('../images/No-Preservative/Mix Millet Vermicelli.png'),
    'Multi Millet cookies.png': require('../images/No-Preservative/Multi Millet cookies.png'),
    'Ragi-choco cookies.png': require('../images/No-Preservative/Ragi-choco cookies.png'),
    'Fusilli-back.png': require('../images/No-Preservative/Fusilli-back.png'),
  };

  return imageMap[imageName] || require('../images/Organic/GoEarth Bilona Ghee (1 Litre).jpg');
};
