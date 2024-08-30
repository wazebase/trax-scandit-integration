import { Injectable } from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {
  Camera,
  DataCaptureContext,
  DataCaptureView, FrameSourceState, RectangularViewfinder, RectangularViewfinderLineStyle, RectangularViewfinderStyle,
  ScanditCaptureCorePlugin
} from 'scandit-capacitor-datacapture-core';
import {
  BarcodeCapture, BarcodeCaptureOverlay, BarcodeCaptureOverlayStyle,
  BarcodeCaptureSettings,
  Symbology,
  SymbologyDescription
} from 'scandit-capacitor-datacapture-barcode';

@Injectable({
  providedIn: 'root'
})
export class ScanditScannerService {
  barcodeCapture;
  constructor(
    private platform: Platform,
    private alertController: AlertController,
  ) {
    this.barcodeCapture = null;
    this.initializeApp();
  }

  initializeApp = () => {
    this.platform.ready().then(async () => {
      // Initialize the plugins.
      await ScanditCaptureCorePlugin.initializePlugins();

      // Enter your Scandit License key here.
      // Your Scandit License key is available via your Scandit SDK web account.
      const context = DataCaptureContext.forLicenseKey('ArvEgxNZNtXhGsHP1RmqEg85n3IiQdKMex8bja0mHaGuRYIZCny/6UVxWq+gB/eF5HJoLQNI7agaQBvFJmqdSwlIJL2ua/wPYwvvAC00D+IuAL6ZyzcrNzoqqCkmfBXnMkrg79p+woksfB6tLHirgnZQj1auHTk0+2tb8ipXT8asZvNwnWSPpsZEoOOLaaILmm+wRvdISQU5SBuAuEIF+ZFT29hpZaCpHwxeKd5tbcQRVWjSg39B2w15B88WZv8F9hIcKC5JhYQ5UIuzoRQp2ktzAPd1ZYI6vVTifAJQGh1xRitTGksUjkRkF9aQFnlAJ2mMOGJYfVfPQ67bOVFvhoRVE4OidApeqmbNuhxljx34ZFPTUno2utdr3uQaByX8LFSOBThPtaeydEbabgklPt5eyO6/K1cLmHXcHAVzPql+TTJENxIL1KFoBbKbEraJZ3Pa1OJ+I29ARFMPZVO7OAxB8+E8KAkVmmo8ZlUmX0ujIT7k3kNWXOl9HO8iXVoJlG21hGgnlRagWAIBpFVHQz5qHFXECoNysQqPOPZvM8E3GXN8T3xbZ/pjHwK2OxknTWar6N5Bt1LvbkozGSNRiBlnKmYMUK7Hjmax/AEaNQf/FnMbvknhHXlYag74Jw7GpUu14Olw8aoVHRGW7VGeV4Jqn478bz3gRQu0DO0XVXMHEi/u42K/HAVvxRFQepw2lE8/d0t/UjzoS1sfTXJLpqFe3BigLe9mn2P7xKxgaCZWc4Yel3aYJBksyviKdNz/9HSvoaZmtBRRd4hSR0kkuzNi4KQFOqauFFMi90Jv1TiHYk3aA0I4KxFU4qjbdO0x+Q44V8JI7Bn6X9PJuk2UG9J/y1hvetDiRleCJSdtdLOYbvbbl0xbZBt132vQZx7JHytikCdrx/uUWE0DK3AzdiJzT4nJIrO+sA2Od/5djO7XRQnZ6Fe4h3osyhe8c8p6KzCQzKh1FsvkWdmf81lQC9NIxDorHTsByP5bBM04OKrf32xYEgHJIzQpF1kQWxtVm7CnpEFRGWCUoCBzRBjFBQRXdptU42pWBOV2dixnqutMncmoBs9nJ0dgQcd0UB3pTfjyVMZaKAYorCBl+Ego0JGmmfer6HEJQQ3yN+0TlRU8hBjLRI2NDYvqe2VqopzNQhVXRhgp9ehcnkiRi1ZiCOA5XLdCygTKpIEmyHR+ATqEfSpyuFVnQbXlY+Xs34hkfeZFx/gLut/iyru35SUtYp4ocVdtdmttPd+dipy66FYGxPAMDcO7YOC/En+7dpiTWQd6J0+Q3ISJuGlkWmy8XI9viIzjQhKrypkoL8mKpmbI6XmECEoMV4xwXo2HqUbBsyiRi8CYgM+xyeTT77KPghCx3jNKM/LmZtQRCGSGad1QMi0Q8Ano9FCTDgknh0sjmlSP2J1qClyVkoVIlOh/HQizSE6SKejvkXxkNxxpScHRDif9Yq9ACzB3qMgJPzsZBiTeZxUhO8enno8qsjzr9gihSrTDU/dEU+jY0xJakQ0bUTdxPHho6F/+lEVSMZx8JIfR6ZiVkXoXXyJDHiOsRrKiQFOdzm3Huhgu7UHU1wd34zc2nfUbyq9T5ZTLRe8EfO8UcsrdKyDHzB+gQQWsrKIyoOzJHia73+B3/poCGWB0tvx9zXjwTR3AyEl1GJPJZwbScahIET8=');

      // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
      // default and must be turned on to start streaming frames to the data capture context for recognition.
      const camera = Camera.default;
      context.setFrameSource(camera);

      // The barcode capturing process is configured through barcode capture settings
      // and are then applied to the barcode capture instance that manages barcode recognition.
      const settings = new BarcodeCaptureSettings();

      // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
      // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
      // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
      settings.enableSymbologies([
        Symbology.EAN13UPCA,
        Symbology.EAN8,
        Symbology.UPCE,
        Symbology.QR,
        Symbology.DataMatrix,
        Symbology.Code39,
        Symbology.Code128,
        Symbology.InterleavedTwoOfFive,
      ]);

      // Some linear/1d barcode symbologies allow you to encode variable-length data. By default, the Scandit
      // Data Capture SDK only scans barcodes in a certain length range. If your application requires scanning of one
      // of these symbologies, and the length is falling outside the default range, you may need to adjust the "active
      // symbol counts" for this symbology. This is shown in the following few lines of code for one of the
      // variable-length symbologies.
      const symbologySettings = settings.settingsForSymbology(Symbology.Code39);
      symbologySettings.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

      // Create new barcode capture mode with the settings from above.
      this.barcodeCapture = BarcodeCapture.forContext(context, settings);

      // Register a listener to get informed whenever a new barcode got recognized.
      this.barcodeCapture.addListener({
        didScan: (barcodeCapture, session, _) => {
          const barcode = session.newlyRecognizedBarcodes[0];
          const symbology = new SymbologyDescription(barcode.symbology);

          // The `alert` call blocks execution until it's dismissed by the user. As no further frames would be
          // processed until the alert dialog is dismissed, we're showing the alert through a timeout and disabling
          // the barcode capture mode until the dialog is dismissed, as you should not block the BarcodeCaptureListener
          // callbacks for longer periods of time. See the documentation to learn more about this.

          barcodeCapture.isEnabled = false;
          this.showResult(`Scanned: ${barcode.data} (${symbology.readableName})`);
        }
      });

      // To visualize the on-going barcode capturing process on screen, setup a data capture view that renders the
      // camera preview. The view must be connected to the data capture context.
      const view = DataCaptureView.forContext(context);

      // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
      view.connectToElement(document.getElementById('dataCaptureView'));

      // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
      // the video preview. This is optional, but recommended for better visual feedback.
      const overlay = BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
        this.barcodeCapture,
        view,
        BarcodeCaptureOverlayStyle.Frame
      );
      overlay.viewfinder = new RectangularViewfinder(
        RectangularViewfinderStyle.Square,
        RectangularViewfinderLineStyle.Light,
      );

      // Switch camera on to start streaming frames and enable the barcode capture mode.
      // The camera is started asynchronously and will take some time to completely turn on.
      camera.switchToDesiredState(FrameSourceState.On);
      this.barcodeCapture.isEnabled = true;
    });
  }

  showResult = async (result) => {
    const alert = await this.alertController.create({
      header: 'Scan result',
      message: result,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.barcodeCapture.isEnabled = true;
            // To show the DataCapture view again, simply set the z-index property of its attached element to 1
            document.getElementById('dataCaptureView').style.zIndex = '1';
          }
        }
      ]
    });
    // The DataCapture view is drawn on top of the webview. To display html elements in place of the
    // capture view, we set its attached element's z-index to -1.
    document.getElementById('dataCaptureView').style.zIndex = '-1';
    await alert.present();
  }
}
