import { PropsWithChildren } from "react";
import { cn } from '../lib/utils';
interface IProps {
    children?: React.ReactNode;
    className?: string;
}
export default function MaxWidthWrap({children, className}: IProps) {
    return (
    <div className={cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20", className)}>
        {children}
    </div>)
}