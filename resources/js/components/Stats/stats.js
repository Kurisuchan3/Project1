import React, { useEffect, useRef, useState } from 'react';
import "./../../../sass/components/stats.scss";

// Filepaths for the SVG illustrations
import HappyGamersSvg from '../../../../public/images/happycustomer.svg';
import ProductsSoldSvg from '../../../../public/images/boxy.svg';
import FiveStarReviewsSvg from '../../../../public/images/review.svg';

const CountUpNumber = ({ value, suffix = '' }) => {
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const target = parseInt(value.replace(/,/g, ''));
    const duration = 3000; // Slower animation (3 seconds)
    let start = 0;
    let current = start;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Cubic easing for smooth animation
      const progressRatio = Math.min(progress / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
      
      current = Math.floor(start + (target - start) * easedProgress);
      countRef.current.textContent = current.toLocaleString() + suffix;

      if (progress < duration && isVisible) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        countRef.current.textContent = target.toLocaleString() + suffix;
      }
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startTime = null;
          current = start;
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsVisible(false);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5
    });

    if (countRef.current) {
      observerRef.current.observe(countRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, suffix, isVisible]);

  return <span ref={countRef} className="count-up-number">0{suffix}</span>;
};

const StatsSection = () => {
  return (
    <section className="stats">
      <div className="stats__item">
        <img src={HappyGamersSvg} alt="Happy Gamers" className="stats__illustration" />
        <div className="stats__card">
          <h3 className="stats__number">
            <CountUpNumber value="100" suffix="+" />
          </h3>
        </div>
        <p className="stats__label">HAPPY GAMERS</p>
      </div>
      
      <div className="stats__item">
        <img src={ProductsSoldSvg} alt="Products Sold" className="stats__illustration stats__illustration--products" />
        <div className="stats__card">
          <h3 className="stats__number">
            <CountUpNumber value="1000" suffix="+" />
          </h3>
        </div>
        <p className="stats__label">PRODUCTS SOLD</p>
      </div>
      
      <div className="stats__item">
        <img src={FiveStarReviewsSvg} alt="5-Star Reviews" className="stats__illustration" />
        <div className="stats__card">
          <h3 className="stats__number">
            <CountUpNumber value="300" suffix="+" />
          </h3>
        </div>
        <p className="stats__label">5 STAR REVIEWS</p>
      </div>
    </section>
  );
};

export default StatsSection;