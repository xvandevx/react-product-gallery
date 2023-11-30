import {useEffect, useMemo, useState} from "react";
import Icon from '/components/common/icon'
import styles from './index.module.scss'
import clsx from "clsx";
import { useSwipeable } from 'react-swipeable';

export default function ProductGallery({images, isShowThumbs = true, isShowMain = true, isShowFull = true, alt}) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const setFullScreen = () => {
        if (isShowFull && window.innerWidth > 768) {
            setIsFullScreen(true)
        }
    }

    useEffect( () => {
        const body = document.querySelector("body");
        if (isFullScreen) {
            body.classList.add("slider");
        } else {
            body.classList.remove("slider");
        }
    }, [isFullScreen] );

    const currentPicture = useMemo(() => {
        return images?.[activeIndex] || {}
    }, [activeIndex, images])

    const currentPicturePath = useMemo(() => {
        return currentPicture ? currentPicture['full'] : '/no_photo.jpeg'
    }, [currentPicture])

    const isMultiPhoto = useMemo(() => {
        return images?.length > 1
    }, [images])



    const moveNext = () => {
        if (activeIndex === (images.length - 1)) {
            setActiveIndex(0)
        } else {
            setActiveIndex(activeIndex+1)
        }
        setIsLoading(true)
        const body = document.querySelector("body");
        body.classList.remove("unscroll");
    }

    const moveBack = () => {
        if (activeIndex === 0) {
            setActiveIndex((images.length - 1))
        } else {
            setActiveIndex(activeIndex - 1)
        }
        setIsLoading(true)
        const body = document.querySelector("body");
        body.classList.remove("unscroll");
    }

    const [onSwipedAction, setOnSwipedAction] = useState('')

    const swipeEnd = () => {
        setOnSwipedAction('');
        const body = document.querySelector("body");
        body.classList.remove("unscroll");
    }

    const handlers = useSwipeable({
        onSwipedLeft: moveNext,
        onSwipedRight: moveBack,
        onSwiping: (action) => {
            const body = document.querySelector("body");

            if (action.deltaX > 20) {
                setOnSwipedAction('back')
                body.classList.add("unscroll");
            }
            if (action.deltaX < -20) {
                setOnSwipedAction('next')
                body.classList.add("unscroll");
            }
        },
        onSwiped: swipeEnd,
        //preventScrollOnSwipe: true,
    });

    return (
        <div className={clsx(styles.Slider, isFullScreen && styles.SliderFullScreen)}>
            {isFullScreen && (
                <>
                    <span
                        className={styles.Close}
                        onClick={() => {
                            setIsFullScreen(false)
                        }}
                    >
                        <Icon fill={'#fff'} id='close' width={22} height={22}/>
                    </span>
                    <div
                        className={styles.Back}
                        onClick={() => {
                            setIsFullScreen(false)
                        }}
                    ></div>
                </>
            )}

            {isShowMain && (
                <div className={clsx(styles.Img, isLoading && styles.ImgLoading)} {...handlers}>
                    {isLoading && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                            <path d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z">
                                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.5s" repeatCount="indefinite"/>
                            </path>
                        </svg>
                    )}
                    {currentPicture.isVideo ? (
                        <iframe
                            src={currentPicturePath}
                            frameBorder={0}
                            onLoad={() => {
                                setIsLoading(false)
                            }}
                        ></iframe>
                    ) : (
                        <img
                            itemProp="image"
                            onLoad={() => {
                                setIsLoading(false)
                            }}
                            onClick={setFullScreen}
                            src={currentPicturePath}
                            alt={alt}
                            title={alt}
                        />
                    )}
                    {isMultiPhoto && (
                        <div className={styles.Arrows}>
                            <span
                                onClick={moveBack}
                                className={clsx(styles.Arrow, onSwipedAction === 'back' && styles.ArrowSwiped)}
                            >
                                <Icon id='arrow' width={20} height={30}/>
                            </span>
                            <span
                                onClick={moveNext}
                                className={clsx(styles.Arrow, onSwipedAction === 'next' && styles.ArrowSwiped)}
                            >
                                <Icon id='arrow' width={20} height={30}/>
                            </span>
                        </div>
                    )}
                </div>
            )}
            {isShowThumbs && isMultiPhoto && (
                <div className={styles.Thumbs}>
                    {images.map((image, index) => (
                        <span
                            key={index}
                            onClick={setFullScreen}
                            onMouseOver={() => {
                                if (index !== activeIndex) {
                                    setActiveIndex(index)
                                    setIsLoading(true)
                                }
                            }}
                            style={{backgroundImage: `url(${image?.thumb})`}}
                            className={clsx(styles.Thumb, activeIndex === index && styles.ThumbActive)}
                        >
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}