'use client'
import ProductsSection from '../components/products';
import HomeCarousel from '../components/homecarousel'


//<Image alt={'Imagem1'} src={''} height={40} width={200}></Image>

const Home = () => {
  return ( 
    <div className="flex flex-col justify-center">
      <HomeCarousel></HomeCarousel>
      <ProductsSection categoryId='1' categoryName='Nike SB'></ProductsSection>
    </div>
  );
}

export default Home;