"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   TYPES
   ============================================================ */

type LayeredImagesProps = {
    images: string[];
};


/* ============================================================
   LAYERED IMAGE COMPONENT
   ============================================================ */

function LayeredImages({ images }: LayeredImagesProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageRefs = useRef<HTMLDivElement[]>([]);

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            const cards = imageRefs.current;

            if (!cards.length) return;

            /*
             * Initial arrangement.
             *
             * The cards overlap, but each one has enough
             * offset that it remains visible.
             */

            gsap.set(cards[0], {
                x: -45,
                y: -80,
                rotate: -5,
                scale: 1,
                zIndex: 3,
            });

            if (cards[1]) {
                gsap.set(cards[1], {
                    x: 45,
                    y: 0,
                    rotate: 4,
                    scale: 0.98,
                    zIndex: 2,
                });
            }

            if (cards[2]) {
                gsap.set(cards[2], {
                    x: -15,
                    y: 85,
                    rotate: -2,
                    scale: 0.96,
                    zIndex: 1,
                });
            }

            /*
             * Scroll-driven movement.
             *
             * We intentionally keep the movement subtle.
             * The images should feel layered rather than
             * flying apart.
             */

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,

                    /*
                     * The animation begins when the image
                     * section enters the viewport.
                     */
                    start: "top bottom",

                    /*
                     * Animation finishes when the section
                     * is almost completely out of view.
                     */
                    end: "bottom top",

                    /*
                     * Scroll controls the animation.
                     */
                    scrub: 1,

                    /*
                     * Recalculate positions if needed.
                     */
                    invalidateOnRefresh: true,
                },
            });

            /*
             * TOP IMAGE
             */

            timeline.to(
                cards[0],
                {
                    x: -95,
                    y: -125,
                    rotate: -8,
                    scale: 1.03,
                    ease: "none",
                },
                0
            );

            /*
             * MIDDLE IMAGE
             */

            if (cards[1]) {
                timeline.to(
                    cards[1],
                    {
                        x: 95,
                        y: 15,
                        rotate: 7,
                        scale: 1,
                        ease: "none",
                    },
                    0
                );
            }

            /*
             * BOTTOM IMAGE
             */

            if (cards[2]) {
                timeline.to(
                    cards[2],
                    {
                        x: -30,
                        y: 125,
                        rotate: -5,
                        scale: 0.99,
                        ease: "none",
                    },
                    0
                );
            }
        }, section);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div
            ref={sectionRef}
            className="relative h-full w-full"
        >
            {/* Image viewport */}

            <div className="sticky top-0 flex h-screen w-full items-center justify-center">

                <div className="relative h-[38rem] w-[32rem] max-w-full">

                    {images.map((src, index) => (
                        <div
                            key={`${src}-${index}`}
                            ref={(element) => {
                                if (element) {
                                    imageRefs.current[index] = element;
                                }
                            }}
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                w-[24rem]
                                -translate-x-1/2
                                -translate-y-1/2
                                overflow-hidden
                                rounded-2xl
                                bg-neutral-200
                                shadow-2xl
                                will-change-transform
                            "
                        >
                            <img
                                src={src}
                                alt=""
                                draggable={false}
                                className="
                                    block
                                    h-auto
                                    w-full
                                    select-none
                                    object-cover
                                "
                            />
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}


/* ============================================================
   BLOG SECTION
   ============================================================ */

type BlogSectionProps = {
    title: string;
    paragraphs: string[];
    images: string[];
    reverse?: boolean;
};

function BlogSection({
    title,
    paragraphs,
    images,
    reverse = false,
}: BlogSectionProps) {
    return (
        <section
            className="
                relative
                min-h-[180vh]
                bg-foreground
                text-background
            "
        >
            <div
                className={`
                    mx-auto
                    grid
                    min-h-[180vh]
                    max-w-7xl
                    grid-cols-1
                    gap-16
                    px-8
                    lg:grid-cols-2
                    lg:gap-20
                    ${reverse ? "lg:[&>*:first-child]:order-2" : ""}
                `}
            >

                {/* ================================================= */}
                {/* TEXT                                               */}
                {/* ================================================= */}

                <div className="relative">

                    <div className="sticky top-0 flex min-h-screen items-center">

                        <div className="max-w-xl py-20">

                            <h2
                                className="
                                    font-inter
                                    text-4xl
                                    font-bold
                                    leading-[1.05]
                                    tracking-tight
                                    sm:text-5xl
                                    lg:text-6xl
                                "
                            >
                                {title}
                            </h2>

                            <div
                                className="
                                    mt-10
                                    max-w-lg
                                    space-y-7
                                    text-lg
                                    leading-relaxed
                                    opacity-80
                                    sm:text-xl
                                "
                            >
                                {paragraphs.map((paragraph, index) => (
                                    <p key={index}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* IMAGES                                             */}
                {/* ================================================= */}

                <div className="relative">

                    <LayeredImages images={images} />

                </div>

            </div>
        </section>
    );
}


/* ============================================================
   PAGE
   ============================================================ */

export default function Page() {
    const introRef = useRef<HTMLDivElement>(null);
    const introBoxRef = useRef<HTMLDivElement>(null);
    const introTitleRef = useRef<HTMLHeadingElement>(null);

    /* ==========================================================
       INTRO GSAP ANIMATION
       ========================================================== */

    useLayoutEffect(() => {
        const intro = introRef.current;
        const box = introBoxRef.current;
        const title = introTitleRef.current;

        if (!intro || !box || !title) return;

        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: intro,

                    /*
                     * Keep the entire intro locked to the
                     * viewport while the box expands.
                     */
                    pin: true,

                    start: "top top",

                    /*
                     * Increase this number if you want
                     * a slower expansion.
                     */
                    end: "+=1200",

                    scrub: 1,

                    anticipatePin: 1,

                    invalidateOnRefresh: true,
                },
            });

            /*
             * Expand the white card.
             */

            timeline.to(
                box,
                {
                    width: "100vw",
                    height: "100vh",
                    borderRadius: "0rem",
                    ease: "none",
                },
                0
            );

            /*
             * Slowly disappear the heading toward the
             * end of the transition.
             */

            timeline.to(
                title,
                {
                    opacity: 0,
                    scale: 0.9,
                    ease: "none",
                },
                0.65
            );
        }, intro);

        return () => {
            ctx.revert();
        };
    }, []);


    /* ==========================================================
       RENDER
       ========================================================== */

    return (
        <main className="w-full overflow-x-hidden bg-black">

            {/* ================================================== */}
            {/* WHY WE EXIST INTRO                                  */}
            {/* ================================================== */}

            <section
                ref={introRef}
                className="
                    relative
                    h-screen
                    w-full
                    bg-black
                "
            >

                <div
                    className="
                        flex
                        h-screen
                        w-full
                        items-center
                        justify-center
                    "
                >

                    <div
                        ref={introBoxRef}
                        className="
                            flex
                            items-center
                            justify-center
                            overflow-hidden
                            bg-foreground
                        "
                        style={{
                            width: "50rem",
                            height: "30rem",
                            borderRadius: "2rem",
                        }}
                    >

                        <h1
                            ref={introTitleRef}
                            className="
                                whitespace-nowrap
                                font-inter
                                text-5xl
                                font-bold
                                text-background
                                sm:text-6xl
                                lg:text-7xl
                            "
                        >
                            Why We Exist?
                        </h1>

                    </div>

                </div>

            </section>


            {/* ================================================== */}
            {/* BLOG                                                */}
            {/* ================================================== */}

            <div className="bg-foreground">


                {/* ================================================= */}
                {/* SECTION 1                                         */}
                {/* ================================================= */}

                <BlogSection
                    title="Doctors spend a lot of time searching through patient history."
                    paragraphs={[
                        "Healthcare is filled with information, decisions, and processes that demand more time than doctors actually have.",
                        "We let doctors give more time to the patient by providing all the context relevant to the case directly on the doctor's dashboard.",
                    ]}
                    images={[
                        "/S11.png",
                        "/S12.png",
                        "/S13.png",
                    ]}
                />


                {/* ================================================= */}
                {/* SECTION 2                                         */}
                {/* ================================================= */}

                <BlogSection
                    title="The information doctors need is scattered everywhere."
                    paragraphs={[
                        "Patient information can exist across reports, prescriptions, previous consultations, laboratory results, and other clinical records.",
                        "Arogya AI brings the relevant information together so doctors can focus on understanding the patient instead of searching for information.",
                    ]}
                    images={[
                        "/S21.png",
                        "/S22.png",
                        "/S23.png",
                    ]}
                    reverse
                />


                {/* ================================================= */}
                {/* SECTION 3                                         */}
                {/* ================================================= */}

                <BlogSection
                    title="Technology should assist doctors, not get in their way."
                    paragraphs={[
                        "The goal isn't to replace the doctor's judgment. It is to reduce the repetitive work surrounding it.",
                        "Arogya AI is designed to work alongside doctors and surface the information they need when they need it.",
                    ]}
                    images={[
                        "/S31.png",
                        "/S32.png",
                        "/S33.png",
                    ]}
                />


                {/* ================================================= */}
                {/* END                                                */}
                {/* ================================================= */}

                <section
                    className="
                        flex
                        min-h-screen
                        items-center
                        justify-center
                        px-8
                    "
                >

                    <h2
                        className="
                            max-w-4xl
                            text-center
                            font-inter
                            text-5xl
                            font-bold
                            tracking-tight
                            sm:text-6xl
                        "
                    >
                        Healthcare should give doctors more time
                        to care for people.
                    </h2>

                </section>

            </div>

        </main>
    );
}