import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import env from "./env.js";


passport.use(new GoogleStrategy({

    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
    
},

    async (accessToken, refreshToken, profile, done) => {

        let user = await User.findOne({
            email: profile.emails[0].value,
        });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
            });
        }

        return done(null, user);
    }
)
);

export default passport;