"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export default function UploadButton() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleOpenChan = (v: boolean) => {
        if (!v) {
            setIsOpen(v);
        }
        
    };
    return (<Dialog open={isOpen} onOpenChange={handleOpenChan}>
        <DialogTrigger asChild onClick={() => {setIsOpen(true)}}>
            <Button>Upload PDF</Button>            
        </DialogTrigger>
        <DialogContent>
            tttttt
        </DialogContent>
    </Dialog>);
}