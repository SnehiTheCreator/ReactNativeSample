package com.midtownalliance;

import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;

import org.devio.rn.splashscreen.SplashScreen;

import com.facebook.react.ReactActivity;

import java.io.IOException;

import pl.droidsonroids.gif.GifDrawable;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onPause() {
        SplashScreen.hide(this);
        super.onPause();
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MidtownAlliance";
    }
}
