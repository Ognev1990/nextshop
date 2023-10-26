"use client"
import {Document , Page, pdfjs} from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {useResizeDetector} from 'react-resize-detector';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import {useForm } from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PdfRendererProps {
    url: string;
}

export default function PdfRenderer({url}: PdfRendererProps) {
    const {toast} = useToast();
    const {width, ref} = useResizeDetector();
    const [numPages, setNumPages] = useState<number>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const CustomPageValidator = z.object({
        page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!)
    });
    

    type TCustomPageValidator = z.infer<typeof CustomPageValidator>;
    const handlePageSubmit = ({page}: TCustomPageValidator) => {
        setCurrentPage(Number(page));
        setValue("page", `${page}`);
    };
    const {
            register, 
            handleSubmit, 
            formState: {errors}, 
            setValue
        } = useForm<TCustomPageValidator>({
        defaultValues: {
            page: "1",
        },
        resolver: zodResolver(CustomPageValidator)
    });
    return (
    <div className="w-full bg-white rounded-md flex flex-col items-center ">
        <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">                
                <Button 
                variant="ghost" 
                aria-label="previus page" 
                disabled={currentPage === 1}
                onClick={() => {
                    setCurrentPage(currentPage - 1)
                }}>
                    <ChevronUp className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1.5">
                    <Input 
                        {...register("page")}
                        onKeyDown={(e) => {
                            console.log(e.key, "key");
                            if (e.key === "Enter") {
                                handleSubmit(handlePageSubmit)();
                            }
                        }} 
                        className={cn("w-12 h-8" , errors.page && "focus-visible:ring-2 focus-visible:ring-red-500")}
                    />
                    <p className="text-zink-700 text-sm space-x-1">
                        <span>/</span>
                        <span>{numPages ?? "x"}</span>
                    </p>
                </div>
                <Button 
                    variant="ghost" 
                    aria-label="next page" 
                    onClick={() => {
                        setCurrentPage(currentPage + 1)
                    }}
                    disabled={currentPage === numPages}
                    >
                    <ChevronDown className="h-4 w-4" />
                </Button>
                
                
            </div>
            
        </div>
        <div className="flex-1 w-full  max-h-screen">
            <div ref={ref}>
                <Document 
                    loading={<div className="flex justify-center">
                        <Loader2 className="my-24 h-6 w-6 animate-spin"/>
                        </div>} 
                    onLoadError={(err) => {
                        toast({
                            title: "Error loading PDF.",
                            description: "Please try again.",
                            variant: "destructive"
                        })
                    }}
                    onLoadSuccess={({numPages}) => {
                        setNumPages(numPages);
                    }}    
                    file={url} 
                    className="max-h-full">
                    <Page width={width ? width : 1} pageNumber={currentPage} />
                </Document>
            </div>
        </div>
    </div>
    )
}