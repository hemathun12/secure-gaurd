import UserSearch from '../components/UserSearch';

const SearchPage = () => {
    return (
        <div className="container mx-auto p-4 pt-24 animate-fade-in flex justify-center">
            <div className="w-full max-w-2xl">
                <UserSearch />
            </div>
        </div>
    );
};

export default SearchPage;
