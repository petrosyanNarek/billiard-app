import { useEffect, useState } from 'react';
import styles from './OptionMenu.module.css';
import { Ball } from '../../App';

interface OptionMenuProps {
    balls: Ball[];
    selectedBallIndex: number | null;
    setBalls: React.Dispatch<React.SetStateAction<Ball[]>>;
    setSelectedBallIndex: React.Dispatch<React.SetStateAction<number | null>>;
    setShowOptionMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OptionMenu: React.FC<OptionMenuProps> =
    (
        {
            balls,
            selectedBallIndex,
            setBalls,
            setSelectedBallIndex,
            setShowOptionMenu,
        }
    ) => {
        const [selectedColor, setSelectedColor] = useState<string>('#43da86');


        useEffect(() => {
            if (selectedBallIndex !== null) {
                setSelectedColor(balls[selectedBallIndex].color);
            }
        }, [selectedBallIndex])

        const changeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (selectedBallIndex !== null) {
                setSelectedColor(event.target.value);
                setBalls(prevBalls => {
                    const newBalls = [...prevBalls];
                    newBalls[selectedBallIndex].color = event.target.value;
                    return newBalls;
                });
            }
        }

        const handleclose = () => {
            setSelectedBallIndex(null);
            setShowOptionMenu(false);

        }

        return (
            <div className={styles.optionMenu}>
                <p>Select your favorite color</p>
                <div className={styles.container}>
                    <input
                        type="color"
                        value={selectedColor}
                        id="color-input"
                        className={styles.inputSelector}
                        onChange={changeColor}
                        onBlur={handleclose}
                    />
                    <label htmlFor="color-input">{selectedColor}</label>
                </div>
            </div>
        )
    }
