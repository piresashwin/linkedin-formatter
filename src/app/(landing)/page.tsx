import Logo from '@/ui/shared/Logo';
import React from 'react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            {/* Hero Section */}
            <header className="text-center py-16">
                <div className='flex flex-row items-center justify-center mb-10'>
                    <Logo></Logo>
                </div>

                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-blue-500 bg-clip-text text-transparent animate-[gradient-radial_3s_infinite]">
                    Simplify Your LinkedIn Post Creation
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Store your ideas, format your text, and create professional LinkedIn posts effortlessly.
                </p>
                <div className="flex justify-center space-x-4">
                    <a href="/login" className="px-6 py-1.5 bg-black text-white rounded-lg shadow hover:bg-gray-800">
                        Log In
                    </a>
                    <a href='/signup' className="px-6 py-1.5 border-2 border-black text-black rounded-lg shadow hover:bg-gray-200">
                        Sign Up
                    </a>
                </div>
            </header>



            {/* Features Section */}
            <section className="mt-16 px-4 text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                    Why Choose Our LinkedIn Formatter?
                </h2>
                <p className="text-gray-600 mb-4">
                    Our tool offers a sleek editor with features like bold, italics, font customization, and more.
                </p>
                <p className="text-gray-600">
                    Save your ideas and revisit them anytime to craft the perfect LinkedIn post.
                </p>
            </section>
        </div>
    );
};

export default LandingPage;