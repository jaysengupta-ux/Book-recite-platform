'use client';

import React, { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { useVapi } from "@/hooks/useVapi";
import { IBook } from "@/types";
import Image from "next/image";
import Transcript from "@/components/Transcript";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";

const VapiControls = ({ book }: { book: IBook }) => {
    // Ingest active user subscription limits from Clerk
    const { limits, isLoaded: isSubscriptionLoaded } = useSubscription();

    // Guard calculation from returning NaN while Clerk hooks are resolving
    const planMaxDurationSeconds = isSubscriptionLoaded && limits?.maxDurationPerSession
        ? limits.maxDurationPerSession * 60 
        : 300; // Safe fallback default of 5 minutes 

    const { 
        status, 
        isActive, 
        messages, 
        currentMessage, 
        currentUserMessage, 
        duration, 
        start, 
        stop, 
        clearError, 
        limitError, 
        isBillingError 
    } = useVapi(book, planMaxDurationSeconds); 
    
    const router = useRouter();

    useEffect(() => {
        if (limitError) {
            toast.error(limitError);
            if (isBillingError) {
                router.push("/subscriptions");
            } else {
                router.push("/");
            }
            clearError();
        }
    }, [isBillingError, limitError, router, clearError]);

    // Format utility guarded explicitly against rendering NaN strings
    const formatDuration = (seconds: number) => {
        const safeSeconds = isNaN(seconds) || seconds < 0 ? 0 : seconds;
        const mins = Math.floor(safeSeconds / 60);
        const secs = safeSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusDisplay = () => {
        switch (status) {
            case 'connecting': return { label: 'Connecting...', color: 'vapi-status-dot-connecting' };
            case 'starting': return { label: 'Starting...', color: 'vapi-status-dot-starting' };
            case 'listening': return { label: 'Listening', color: 'vapi-status-dot-listening' };
            case 'thinking': return { label: 'Thinking...', color: 'vapi-status-dot-thinking' };
            case 'speaking': return { label: 'Speaking', color: 'vapi-status-dot-speaking' };
            default: return { label: 'Ready', color: 'vapi-status-dot-ready' };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <>
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {/* Header Card */}
                <div className="vapi-header-card flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-xl shadow-sm border border-neutral-100">
                    <div className="vapi-cover-wrapper flex-shrink-0 relative w-[120px]">
                        <Image
                            src={book.coverURL || "/images/book-placeholder.png"}
                            alt={book.title}
                            width={120}
                            height={180}
                            className="vapi-cover-image rounded-md object-cover shadow-sm h-[180px]"
                            priority
                        />
                        <div className="vapi-mic-wrapper absolute -bottom-3 -right-3">
                            {isActive && (status === 'speaking' || status === 'thinking') && (
                                <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
                            )}
                            <button
                                onClick={isActive ? stop : start}
                                disabled={status === 'connecting' || !isSubscriptionLoaded}
                                className={`vapi-mic-btn shadow-md w-[50px] h-[50px] rounded-full flex items-center justify-center transition ${
                                    isActive ? 'bg-red-500 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                                }`}
                            >
                                {isActive ? (
                                    <Mic className="size-5" />
                                ) : (
                                    <MicOff className="size-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between flex-1 gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#212a3b] mb-1">
                                {book.title}
                            </h1>
                            <p className="text-[#3d485e] font-medium">by {book.author}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="vapi-status-indicator px-3 py-1 bg-neutral-50 rounded-full flex items-center gap-2 border border-neutral-100 text-sm">
                                <span className={`w-2.5 h-2.5 rounded-full ${statusDisplay.color}`} />
                                <span className="vapi-status-text font-medium text-neutral-600">{statusDisplay.label}</span>
                            </div>

                            <div className="vapi-status-indicator px-3 py-1 bg-neutral-50 rounded-full flex items-center border border-neutral-100 text-sm font-medium text-neutral-600">
                                Voice: {book.persona || "Daniel"}
                            </div>

                            <div className="vapi-status-indicator px-3 py-1 bg-neutral-50 rounded-full flex items-center border border-neutral-100 text-sm font-medium text-neutral-600">
                                {formatDuration(duration)}/{formatDuration(planMaxDurationSeconds)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transcript Wrap */}
                <div className="vapi-transcript-wrapper bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                    <div className="transcript-container min-h-[400px]">
                        <Transcript
                            messages={messages}
                            currentMessage={currentMessage}
                            currentUserMessage={currentUserMessage}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default VapiControls;