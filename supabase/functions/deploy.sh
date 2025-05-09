#!/bin/bash

# Deploy tickets function
echo "Deploying tickets function..."
npx supabase functions deploy tickets --no-verify-jwt --project-ref iyvtzkxikdrdskstfmdf

# Deploy draws function
echo "Deploying draws function..."
npx supabase functions deploy draws --no-verify-jwt --project-ref iyvtzkxikdrdskstfmdf

# Deploy activities function
echo "Deploying activities function..."
npx supabase functions deploy activities --no-verify-jwt --project-ref iyvtzkxikdrdskstfmdf

echo "Deployment complete!" 