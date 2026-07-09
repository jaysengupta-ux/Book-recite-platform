'use client';

import { useAuth, useUser, useSession } from "@clerk/nextjs"; // 💡 Added useSession
import { PLANS, PLAN_LIMITS, PlanType } from "@/lib/subscription-constants";
import { useEffect } from "react";

export const useSubscription = () => {
    const { has, isLoaded: isAuthLoaded } = useAuth();
    const { user, isLoaded: isUserLoaded } = useUser();
    const { session } = useSession(); // 💡 Get the active client session token control wrapper

    const isLoaded = isAuthLoaded && isUserLoaded;

    // 💡 FORCE CLERK REFRESH ON MOUNT:
    // This breaks the local session cache and forces Clerk to sync immediately 
    // with your real-time backend updates when shifting tiers!
    useEffect(() => {
        if (session) {
            session.reload().catch((err) => 
                console.error("Clerk Session cache reload failed:", err)
            );
        }
    }, [session]);

    if (!isLoaded) {
        return {
            plan: PLANS.FREE,
            limits: PLAN_LIMITS[PLANS.FREE],
            isLoaded: false
        };
    }

    let plan: PlanType = PLANS.FREE;

    // 1. First Check: Clerk's `has` helper from useAuth
    if (has?.({ product: 'pro' }) || has?.({ plan: 'pro' })) {
        plan = PLANS.PRO;
    } else if (has?.({ product: 'standard' }) || has?.({ plan: 'standard' })) {
        plan = PLANS.STANDARD;
    } 
    // 2. Second Check: Fallback to user public metadata if `has` fails (caching issue)
    else {
        const metadataPlan = (user?.publicMetadata?.plan || user?.publicMetadata?.billingPlan)?.toString().toLowerCase();
        
        if (metadataPlan === 'pro') {
            plan = PLANS.PRO;
        } else if (metadataPlan === 'standard') {
            plan = PLANS.STANDARD;
        }
    }

    return {
        plan,
        limits: PLAN_LIMITS[plan],
        isLoaded: true
    };
};