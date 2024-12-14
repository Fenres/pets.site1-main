import CardPats from "../components/cardpets";
import News from "../components/news";
import Slider from "../components/slider";

function MainPage() {
    return (
        <div className="w-100">
            <h2 className="text-center text-white bg-primary m-2">Найденные животные</h2>
            <Slider />
            <h2 className="text-center text-white bg-primary m-2">Карточки найденных животных</h2>
            <CardPats />
            <News />
        </div>
    );
}

export default MainPage;
