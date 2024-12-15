// import {Boxes} from "@/components/ui/background-boxes"
import {BackgroundLines} from "@/components/ui/background-lines";
import {FlipWords} from "@/components/ui/flip-words";

import {cn} from "@/lib/utils";


import {
    IconAdjustmentsBolt,
    IconCloud,
    IconCurrencyDollar,
    IconEaseInOut,
    IconHeart,
    IconHelp,
    IconRouteAltLeft,
    IconTerminal2,
} from "@tabler/icons-react";
import React from "react";


//bento import

import Image from "@/components/divex/Image"

import createGlobe from "cobe";
import {useEffect, useRef} from "react";
import {motion} from "framer-motion";
import {IconBrandYoutubeFilled} from "@tabler/icons-react";

const theWords = ["empower", "modernize", "enhance", "develop"]
const featuresGrid = [
    {
        title: "Built for developers",
        description:
            "Built for engineers, developers, dreamers, thinkers and doers.",
        icon: <IconTerminal2/>,
    },
    {
        title: "Ease of use",
        description:
            "It's as easy as using an Apple, and as expensive as buying one.",
        icon: <IconEaseInOut/>,
    },
    {
        title: "Pricing like no other",
        description:
            "Our prices are best in the market. No cap, no lock, no credit card required.",
        icon: <IconCurrencyDollar/>,
    },
    {
        title: "100% Uptime guarantee",
        description: "We just cannot be taken down by anyone.",
        icon: <IconCloud/>,
    },
    {
        title: "Multi-tenant Architecture",
        description: "You can simply share passwords instead of buying new seats",
        icon: <IconRouteAltLeft/>,
    },
    {
        title: "24/7 Customer Support",
        description:
            "We are available a 100% of the time. Atleast our AI Agents are.",
        icon: <IconHelp/>,
    },
    {
        title: "Money back guarantee",
        description:
            "If you donot like EveryAI, we will convince you to like us.",
        icon: <IconAdjustmentsBolt/>,
    },
    {
        title: "And everything else",
        description: "I just ran out of copy ideas. Accept my sincere apologies",
        icon: <IconHeart/>,
    },
];


export default function Landing() {
    const features = [
        {
            title: "Track your dividends effectively",
            description:
                "Track and manage your dividends, by creating portfolios, goals and tracking yields.",
            skeleton: <SkeletonOne/>,
            className:
                "col-span-1 lg:col-span-4",
        },
        {
            title: "Calendar",
            description:
                "Never lose track of dividend dates, with the up-to-date calendar of stock and their dividend dates",
            skeleton: <SkeletonTwo/>,
            className: "col-span-1 lg:col-span-2",
        },
        {
            title: "Watch our AI on YouTube",
            description:
                "Whether its you or Tyler Durden, you can get to know about our product on YouTube",
            skeleton: <SkeletonThree/>,
            className:
                "col-span-1 lg:col-span-3",
        },
        {
            title: "Deploy in seconds",
            description:
                "With our blazing fast, state of the art, cutting edge, we are so back cloud servies (read AWS) - you can deploy your model in seconds.",
            skeleton: <SkeletonFour/>,
            className: "col-span-1 lg:col-span-3",
        },
    ];

    return (
        <div className="flex flex-col gap-16">
            <div className="flex flex-col">
                <h1 className="font-semibold text-9xl">Div<p className="inline text-teal-700 font-bold">Ex</p></h1>
                <div className="text-6xl mr-80"><FlipWords className="font-extrabold text-teal-700" words={theWords}
                                                           duration={1650}/></div>
                <p className="text-5xl ml-36">your portfolio</p>
                <a className="text-red-600 text-9xl mt-24" href="/app">GO TO APP</a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 rounded-md gap-8">
                {features.map((feature) => (
                    <FeatureCard key={feature.title} className={feature.className}>
                        <FeatureTitle>{feature.title}</FeatureTitle>
                        <FeatureDescription>{feature.description}</FeatureDescription>
                        <div className=" h-full w-full">{feature.skeleton}</div>
                    </FeatureCard>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
                {featuresGrid.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index}/>
                ))}
            </div>
        </div>
    )
}

const Feature = ({
                     title,
                     description,
                     icon,
                     index,
                 }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}
        >
            {index < 4 && (
                <div
                    className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none"/>
            )}
            {index >= 4 && (
                <div
                    className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none"/>
            )}
            <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div
                    className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center"/>
                <span
                    className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};


// bento

const FeatureCard = ({
                         children,
                         className,
                     }: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`dark:bg-slate-900 rounded-3xl p-4 sm:p-8 relative overflow-hidden`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle = ({children}: { children?: React.ReactNode }) => {
    return (
        <p className="max-w-5xl  text-left tracking-tight text-black dark:text-white text-5xl font-semibold md:leading-snug">
            {children}
        </p>
    );
};

const FeatureDescription = ({children}: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-2xl  max-w-4xl mx-auto",
                "text-neutral-500 text-center font-normal dark:text-neutral-300",
                "text-left max-w-sm mx-0 mt-4"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonOne = () => {
    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">

            {/* TODO */}
            <Image
                src="/div-sum.png"
                alt="header"
                width={1100}
                height={600}
                className="aspect-square object-cover object-left-top"
            />


            <div
                className="absolute bottom-52 z-40 inset-x-0 h-64 bg-gradient-to-t from-white dark:from-slate-900 to-transparent w-full pointer-events-none"/>
            <div
                className="absolute top-6 z-40 inset-x-0 h-64 bg-gradient-to-b from-white dark:from-slate-900 to-transparent w-full pointer-events-none"/>
            <div
                className="absolute left-12 z-40 inset-y-0 w-44 bg-gradient-to-r from-white dark:from-slate-900 to-transparent h-full pointer-events-none"/>
            <div
                className="absolute right-10 z-40 inset-y-0 w-44 bg-gradient-to-l from-white dark:from-slate-900 to-transparent h-full pointer-events-none"/>
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <a
            href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
            target="__blank"
            className="relative flex gap-10  h-full group/image"
        >
            <div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
                    {/* TODO */}
                    <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto "/>
                    <Image
                        src="https://assets.aceternity.com/fireship.jpg"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
                    />
                </div>
            </div>
        </a>
    );
};

export const SkeletonTwo = () => {
    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
            {/* TODO */}
            <Image
                src="/div-cal.png"
                alt="header"
                width={284}
                height={384}
                className="aspect-square object-cover object-left-top"
            />


            <div
                className="absolute bottom-[425px] z-40 inset-x-0 h-20 bg-gradient-to-t from-white dark:from-slate-900 to-transparent w-full pointer-events-none"/>
            <div
                className="absolute top-7 z-40 inset-x-0 h-20 bg-gradient-to-b from-white dark:from-slate-900 to-transparent w-full pointer-events-none"/>
            <div
                className="absolute left-8 z-40 inset-y-0 w-12 bg-gradient-to-r from-white dark:from-slate-900 to-transparent h-full pointer-events-none"/>
            <div
                className="absolute right-52 z-40 inset-y-0 w-12 bg-gradient-to-l from-white dark:from-slate-900 to-transparent h-full pointer-events-none"/>
            {/*<div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />*/}
            {/*<div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />*/}
        </div>
    );
};

export const SkeletonFour = () => {
    return (
        <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72"/>
        </div>
    );
};

export const Globe = ({className}: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                // longitude latitude
                {location: [37.7595, -122.4367], size: 0.03},
                {location: [40.7128, -74.006], size: 0.1},
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{width: 600, height: 600, maxWidth: "100%", aspectRatio: 1}}
            className={className}
        />
    );
};