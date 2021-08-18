import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';


// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    // variável para aparecer as listas dos filmes
    const [movieList, setMovieList] = useState([]);
    // variável para achar o ano do filme
    const [featuredData, setFeaturedData] = useState(null);
    // variável pro header ficar preto
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            // Pegando a lista TOTAL
            let list = await Tmdb.getHomeList();
            setMovieList(list);

            // Pegando o Featured
            let originals = list.filter(i => i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }
        loadAll();
    }, []);

    useEffect(() => {
        // Para saber quando o mouse descer
        const scrollListener = () => {
            if(window.scrollY > 10) {
                setBlackHeader(true);
            }else {
                setBlackHeader(false);
            }
        }
        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

    return (
        <div className="page">

        <Header black={blackHeader}/>
        
        {featuredData && <FeaturedMovie item={featuredData}/>}
        
	    <section className="lists"> 
	  	    {movieList.map((item, key) => (
                <MovieRow key={key} title={item.title} items={item.items} />
		    ))}
	    </section>

        <footer>
            Feito com <span role="img" arial-label="coração">❤️</span> por &nbsp;<a href="https://github.com/naaracrv"> Naara Veronez </a><br/>
            Direitos de imagem para &nbsp;<a href="https://www.netflix.com/br/login?nextpage=https%3A%2F%2Fwww.netflix.com%2Fbrowse"> Netflix </a><br/>
            Dados coletados do site &nbsp;<a href="https://www.themoviedb.org"> Themoviedb.org </a>
        </footer>


        {movieList.length <= 0 && // para saber quando ficar preto
            <div className="loading">
                <img src="https://pa1.narvii.com/6704/4b3f34a861c9ac5d902b8cb24ddf302e26616bea_hq.gif" alt="carregando" />
            </div>
        }
    </div>
    );
};
