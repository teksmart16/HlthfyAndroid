import { ImageRequireSource } from 'react-native';

export const getImageSource = (imageName: string): ImageRequireSource => {
  const imageMap: { [key: string]: any } = {
    'GoEarth_Bilona_Ghee__1_Litre.jpg': require('../images/Organic/Groceries/GoEarth_Bilona_Ghee__1_Litre.jpg'),
    'GoEarth Bilona Ghee (1 Litre).jpg': require('../images/Organic/Groceries/GoEarth_Bilona_Ghee__1_Litre.jpg'),
    'Go Earth Premium Organic Brown Sugar.jpg': require('../images/Organic/Groceries/Go Earth Premium Organic Brown Sugar.jpg'),
    'Healthy Organic Jaggery.jpg': require('../images/Organic/Groceries/Healthy Organic Jaggery.jpg'),
    'Besan-Gram Flour.jpg': require('../images/Organic/Groceries/Besan-Gram Flour.jpg'),
    'Black CTC Tea.jpg': require('../images/Organic/Groceries/Black CTC Tea.jpg'),
    'Amla Candy Sweet.jpg': require('../images/Organic/Groceries/Amla Candy Sweet.jpg'),
    'Go Earth Organic Groundnut Seed.jpg': require('../images/Organic/Groceries/Go Earth Organic Groundnut Seed.jpg'),
    'Hyper Nature Neem bathing Bar.jpg': require('../images/Organic/Toiletries/Hyper Nature Neem bathing Bar.jpg'),
    'Aloevera Bar (by Hyper Nature).jpg': require('../images/Organic/Toiletries/Aloevera Bar (by Hyper Nature).jpg'),
    'Hyper Nature Classic Ubtan Soap(100g).jpg': require('../images/Organic/Toiletries/Hyper Nature Classic Ubtan Soap(100g).jpg'),
    'Hyper Nature Charcoal Bar.jpg': require('../images/Organic/Toiletries/Hyper Nature Charcoal Bar.jpg'),
    'Hyper Nature Premium Bridal Beauty Bar.jpg': require('../images/Organic/Toiletries/Hyper Nature Premium Bridal Beauty Bar.jpg'),
    'De-Tan Bar (by Hyper Nature).jpg': require('../images/Organic/Toiletries/De-Tan Bar (by Hyper Nature).jpg'),
    'Glow Facial Bar.jpg': require('../images/Organic/Toiletries/Glow Facial Bar.jpg'),
    'Hyper Nature Skin Brightening Bar (100g).jpg': require('../images/Organic/Toiletries/Hyper Nature Skin Brightening Bar (100g).jpg'),
    'Hyper Nature Fenugreek Anti-Dandruff Shampoo.jpg': require('../images/Organic/Toiletries/Hyper_Nature_Fenugreek_Anti-Dandruff_Shampoo.png'),
    'Hyper Nature Nourishing Herbal Shampoo Bar.jpg': require('../images/Organic/Toiletries/Hyper_Nature_Nourishing_Herbal_Shampoo_Bar.png'),
    'Bridal Beauty Bar.jpg': require('../images/Organic/Toiletries/Bridal Beauty Bar.jpg'),

    // No-Preservative images
    'Mix Millet Fusilli-Front.png': require('../images/No-Preservative/Mix Millet Fusilli.png'),
    'Mix Millet Macaroni.png': require('../images/No-Preservative/Mix Millet Macaroni.png'),
    'Mix Millet Noodles.png': require('../images/No-Preservative/Mix Millet Noodles.png'),
    'Mix Millet Penne.png': require('../images/No-Preservative/Mix Millet Penne.png'),
    'Mix Millet Vermicelli.png': require('../images/No-Preservative/Mix Millet Vermicelli.png'),
    'Multi Millet cookies.png': require('../images/No-Preservative/Multi Millet cookies.png'),
    'Ragi-choco cookies.png': require('../images/No-Preservative/Ragi-choco cookies.png'),
    'Fusilli-back.png': require('../images/No-Preservative/Mix Millet Fusilli.png'),
  };

  return imageMap[imageName] || require('../images/Organic/Groceries/GoEarth_Bilona_Ghee__1_Litre.jpg');
};
