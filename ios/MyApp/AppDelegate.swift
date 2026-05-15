import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "employee-app",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // 👇 YEH HAI REAL PRODUCTION METHOD: Objective-C bridge ko crash-free style me read karna
  func application(
    _ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?
  ) -> UIInterfaceOrientationMask {
    
    // Agar library (Orientation) project me linked hai, toh yeh usse uska current status poochega safely
    if let orientationClass = NSClassFromString("Orientation") as? AnyObject {
      let selector = Selector(("getOrientation"))
      if orientationClass.responds(to: selector) {
        if let method = orientationClass.method(for: selector) {
          typealias FunctionType = @convention(c) (AnyClass, Selector) -> UInt
          let function = unsafeBitCast(method, to: FunctionType.self)
          let rawValue = function(orientationClass.self as! AnyClass, selector)
          return UIInterfaceOrientationMask(rawValue: rawValue)
        }
      }
    }
    
    // Agar library load nahi hui ya app abhi start ho rahi hai, toh default Portrait rakho
    return .portrait
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
