import * as React from 'react';
import { Button } from '@/components/ui/button';
import {BackgroundBeams} from "@/components/ui/background-beams";

export default function Test() {
    return (
        <div className="">
            <div className="h-[40rem] relative">
                <h1>Test</h1>

            </div>
            <div className="h-[40rem] bg-slate-900 ">
                <div className="relative h-full w-full">
                    <BackgroundBeams />
                </div>
            </div>
            <div className="h-[40rem] bg-zinc-900">
            </div>
        </div>
    )
}