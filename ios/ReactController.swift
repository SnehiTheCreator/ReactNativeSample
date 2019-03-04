//
//  ReactController.swift
//  MidtownAlliance
//
//  Created by Allison L Shepherd on 12/8/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import UIKit

class ReactController: UIViewController {
  
  var launchOptions: NSDictionary = NSDictionary()
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Do any additional setup after loading the view.\
    print("react")
    setupReact()
  }
  
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }
  
  
  
  func setupReact(){
    
    var jsCodeLocation: URL;
    
    jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index.ios", fallbackResource: nil)
    
    var lo: [AnyHashable:Any]?
    if let options:[AnyHashable:Any] = launchOptions as? [AnyHashable:Any] {
      lo = options
    }
    
    let rootView: RCTRootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "MidtownAlliance", initialProperties: nil, launchOptions: lo)
    
    
    rootView.backgroundColor = UIColor(red: CGFloat(1.0), green: CGFloat(1.0), blue: CGFloat(1.0), alpha: CGFloat(1))
    self.view.addSubview(rootView)
    rootView.frame = self.view.bounds
  }
  
  
}
