//
//  SplashController.swift
//  MidtownAlliance
//
//  Created by Allison L Shepherd on 12/8/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import UIKit


class SplashController: UIViewController {

 
  @IBOutlet weak var imageView: UIImageView!
  var launchOptions: NSDictionary = NSDictionary()
  
    override func viewDidLoad() {
      super.viewDidLoad()
      setupView()
      Timer.scheduledTimer(timeInterval: 5.0, target: self, selector: #selector(navigateToReact), userInfo: nil, repeats: false);
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
  
  func navigateToReact() {
    
    print("timed ")
    imageView.stopAnimating()
    imageView.animationImages = nil
    let mainStoryBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
    let reactController: ReactController = mainStoryBoard.instantiateViewController(withIdentifier: "reactController") as! ReactController
    reactController.launchOptions = launchOptions
    //self.view.window?.rootViewController = reactController
    
    let delegate: AppDelegate = UIApplication.shared.delegate as! AppDelegate
    
    delegate.window!.rootViewController = reactController;
    
    
  }
  
  
  override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    // do nothing 
    
    
    
  }
  
 
  


  func setupView() {
    var array: [UIImage] = [];
    
    imageView.animationImages = [];
    for i in 0...149 {
      var imageName = "ma-loader" + String(format: "%04d", i)
      if (UIDevice.current.tallScreen) {
        imageName = "ma-loader-iphone-x" + String(format: "%04d", i)
      }
      if let frame = UIImage(named: imageName) {
        array.append(frame)
      }
    }
    imageView.animationImages = array
    imageView.animationDuration = 5
    imageView.startAnimating()
  }
  
}
