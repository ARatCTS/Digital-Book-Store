import { Link } from 'react-router-dom';

export default function HeroSection(){
    return(
            <div className="bg-white py-14 px-6 sm:px-12 bg-gradient-to-r from-pink-50 via-pink-50 to-blue-100">
        <div className="max-w-screen-xl mx-auto">
            <div className="max-w-screen-md">
                <h2 className="text-slate-900 xl:text-6xl md:text-5xl text-4xl font-bold !leading-tight">Discover Your Next Great Read</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 mt-6">
                <div>
                    <p className="text-slate-600 text-base leading-relaxed">Explore a curated collection of ready-to-use components and design blocks, empowering you to create stunning, responsive interfaces with ease. Streamline your workflow and discover the future of web development.</p>
                    <div className="mt-12 flex gap-6 items-center flex-wrap">
                        <Link to="/books"
                            className="bg-[#55F5A3] hover:bg-green-400 transition-all text-slate-900 font-semibold text-[15px] rounded-full px-6 py-3 cursor-pointer">
                            Explore Collection
                        </Link>
                        <Link to="/about" className="text-slate-900 text-[15px] font-semibold underline max-sm:block whitespace-nowrap">Learn More About Us</Link> {/* Changed API Docs to About Us for a bookstore */}
                    </div>

                </div>

                <div className="aspect-[7/4]">
                    {/* Replaced dashboard image with a book-related image */}
                    <img src='https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' class="shrink-0 w-full h-full rounded-md object-cover" alt="Bookshelf" />
                </div>
            </div>
        </div>
    </div>
    );

}