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

        console.log("profile : ", profile)
        console.log("displayName : ", profile.displayName)
        console.log("emails : ", profile.emails[0].value)
        console.log("photos : ", profile.photos[0].value)

        let user = await User.findOne({
            email: profile.emails[0].value,
        });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                profilePicture: profile.photos[0].value,
                email: profile.emails[0].value,
            });
            
            console.log("User : ", user)
        }

        return done(null, user);
    }
)
);

export default passport;