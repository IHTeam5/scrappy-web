const tl = gsap.timeline({defaults: {ease: "power1.out"}});
tl.fromTo(".about-text", { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5  });
