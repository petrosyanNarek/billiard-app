import { useEffect, useRef, useState } from "react";
import { Ball } from "../../App";

const tableWidth = 600;
const tableHeight = 300;
const friction = 0.99;

interface GameCanvasProps {
    balls: Ball[];
    setBalls: React.Dispatch<React.SetStateAction<Ball[]>>;
    setBallIndexForChange: React.Dispatch<React.SetStateAction<number | null>>;
    setShowOptionMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ balls, setBalls, setBallIndexForChange, setShowOptionMenu }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredBall, setHoveredBall] = useState<Ball | null>(null);
    const [selectedBallIndex, setSelectedBallIndex] = useState<number | null>(null);
    const [dragStartCoords, setDragStartCoords] = useState<{ x: number; y: number } | null>(null);
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectedBallIndex !== null && dragStartCoords) {

            const canvas = canvasRef.current;
            if (!canvas) return;
            const mouseX = event.nativeEvent.offsetX;
            const mouseY = event.nativeEvent.offsetY;
            const dx = mouseX - dragStartCoords.x;
            const dy = mouseY - dragStartCoords.y;

            setBalls(prevBalls => {
                const newBalls = [...prevBalls];
                newBalls[selectedBallIndex].vx = dx * 0.05;
                newBalls[selectedBallIndex].vy = dy * 0.05;
                return newBalls;
            });
            canvas.removeEventListener('mousemove', () => { });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            let foundHoveredBall = false;

            balls.forEach((ball, index) => {
                const dx = mouseX - ball.x;
                const dy = mouseY - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < ball.radius) {
                    foundHoveredBall = true;
                    setHoveredBall(ball);
                    canvas.onclick = () => {
                        setSelectedBallIndex(index);
                        setDragStartCoords({ x: mouseX, y: mouseY });
                    }

                    canvas.addEventListener('contextmenu', (e) => {
                        e.preventDefault(); // Prevent default context menu
                        setShowOptionMenu(true);
                        setBallIndexForChange(index);
                    });
                    return;
                } else {
                    setSelectedBallIndex(null);
                    setDragStartCoords(null);
                }
            });

            if (!foundHoveredBall) {
                setHoveredBall(null);
            }
        };

        const handleMouseUp = () => {
            setSelectedBallIndex(null);
            setDragStartCoords(null);
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawTable(ctx);
            updateBalls();
            drawBalls(ctx);
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (hoveredBall) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'auto';
        }
    }, [hoveredBall]);

    const drawTable = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'brown';
        ctx.fillRect(0, 0, tableWidth, tableHeight);
    };

    const drawBalls = (ctx: CanvasRenderingContext2D) => {
        balls.forEach(ball => {
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const updateBalls = () => {
        balls.forEach(ball => {
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Check collision with other balls
            balls.forEach(otherBall => {
                if (ball !== otherBall) {
                    const dx = otherBall.x - ball.x;
                    const dy = otherBall.y - ball.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < ball.radius + otherBall.radius) {
                        // Collision detected, swap velocities
                        const tempVx = ball.vx;
                        const tempVy = ball.vy;
                        ball.vx = otherBall.vx;
                        ball.vy = otherBall.vy;
                        otherBall.vx = tempVx;
                        otherBall.vy = tempVy;

                        // Move the balls so they are not intersecting
                        const overlap = 0.5 * (distance - ball.radius - otherBall.radius);
                        ball.x -= overlap * (ball.x - otherBall.x) / distance;
                        ball.y -= overlap * (ball.y - otherBall.y) / distance;
                        otherBall.x += overlap * (ball.x - otherBall.x) / distance;
                        otherBall.y += overlap * (ball.y - otherBall.y) / distance;
                    }
                }
            });

            // Check collision with canvas walls
            if (ball.x - ball.radius < 0 || ball.x + ball.radius > tableWidth) {
                ball.vx *= -1;
            }

            if (ball.y - ball.radius < 0 || ball.y + ball.radius > tableHeight) {
                ball.vy *= -1;
            }

            // Apply friction
            ball.vx *= friction;
            ball.vy *= friction;
        });
    };
    return (
        <canvas
            ref={canvasRef}
            width={tableWidth}
            height={tableHeight}
            onMouseMove={handleMouseMove}
        />
    )
}