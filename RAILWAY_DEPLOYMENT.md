# Railway Deployment Guide

## Prerequisites
- Railway account (railway.app)
- GitHub repository connected to Railway
- Java 21 and Maven installed locally
- Supabase account with database and storage configured

## Deployment Steps

### Step 1: Connect GitHub to Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create a new project
4. Select "Deploy from GitHub"
5. Connect your `mobile-apps-team-19` repository
6. Select the `Railway` branch

### Step 2: Configure Environment Variables in Railway Dashboard
After connecting your repo, Railway will prompt you to add environment variables. Set these:

**Supabase Configuration:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

**Spring Configuration:**
- `SPRING_PROFILES_ACTIVE` - Set to `prod`

**CORS Configuration (Update after deployment):**
- `CORS_ALLOWED_ORIGINS` - Your frontend URL (you'll update this after frontend deployment)

**Optional - Database:**
- `SPRING_DATASOURCE_URL` - Leave as default (uses Supabase) or use Railway PostgreSQL
- `SPRING_DATASOURCE_USERNAME` - Leave as default or update for Railway DB
- `SPRING_DATASOURCE_PASSWORD` - Leave as default or update for Railway DB

### Step 3: Build & Deploy
1. Railway will automatically detect `railway.json` configuration
2. It will:
   - Build: `mvn clean package -DskipTests` in the `Backend/recall` directory
   - Deploy: Run the JAR with `java -Dserver.port=$PORT -jar target/recall-0.0.1-SNAPSHOT.jar`
3. Monitor the build/deploy logs in Railway dashboard
4. Once deployed, Railway will provide a public URL (e.g., `https://your-app-name.railway.app`)

### Step 4: Update Frontend Configuration
Once your backend is deployed on Railway:

1. Copy your Railway backend URL
2. Update the **frontend** environment variables (create `.env` file in `Frontend/` directory):
   ```
   EXPO_PUBLIC_API_URL=https://your-railway-app.railway.app/api
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Build and deploy your frontend to EAS or your hosting platform

### Step 5: Update CORS in Railway
After deploying frontend, update the `CORS_ALLOWED_ORIGINS` environment variable in Railway dashboard with your frontend URL.

## Testing
1. Check Railway logs to ensure app started successfully
2. Test backend endpoints: `https://your-railway-app.railway.app/api/events`
3. Verify frontend can call backend API
4. Test Supabase connections (file uploads, database queries)

## Important Notes
- Do NOT commit `.env` files with real credentials to GitHub
- Use `.env.example` as a template
- Railway automatically restarts the app if it crashes (configured in `railway.json`)
- Monitor Railway logs if issues occur
- The build takes ~2-3 minutes first time

## Rollback
If something goes wrong:
1. Go to Railway dashboard
2. Select Deployments tab
3. Click "Rollback" on a previous successful deployment

## Troubleshooting
- **Build fails**: Check `system.properties` for Java version (must be 21)
- **App crashes**: Check Railway logs for errors
- **Database connection fails**: Verify environment variables match your Supabase credentials
- **CORS errors**: Update `CORS_ALLOWED_ORIGINS` with correct frontend URL
