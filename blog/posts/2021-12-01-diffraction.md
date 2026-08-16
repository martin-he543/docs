# Investigation of Diffraction Patterns and Interference

```post-data
{
  "date": "2021-12-01",
  "tags": [
    "report",
    "university",
    "labs",
    "archived"
  ],
  "summary": "Completed in the Blackett Laboratory as part of First Year Labs."
}
```

**Abstract --	We obtained values for the slit width (a) and slit separation (d) of two diffracting objects by conducting manual measurements and using predictions from the wave theory of light, as well as a CMOS camera to compare the intensity curve of the diffraction patterns with its theoretical distributions. Using the curve_fit function built into scipy, we subsequently were able to obtain minima graphs and ascertain values for a and d. Our experimental values were: a = (9.49±6.48)×10-5 m manually, and a = (11.51±0.23)×10-5 m using the CMOS camera for single slit; whereas, we obtained d = (2.88±0.43)×10-4 m, and d = (4.64±0.12)×10-4 m for double slit. The values for a lie in the uncertainty ranges of each other so are in agreement, whereas values of d are outside of their respective ranges. Both intensity profile plots obtained from the CMOS follow the theoretical distributions very rigidly.**

## I. Introduction

DIFFRACTION, otherwise referred to as interference depending on the experimental set-up, occurs due to the superposition of multiple waves such that the resultant amplitude, hence intensity, depends upon the characteristics of the component waves. When speaking in terms of a few waves (such as those originating from different optical paths), we opt for interference, whilst when describing a continuum of waves (such as light passing through a single slit) we prefer the word diffraction. The discovery of these patterns in Young’s Double-Slit Experiment highlighted the wave-like properties of light, which ultimately shaped our modern understanding of light, as behaviour in a dual sense.

## II. Theory

Diffraction that occurs close to an object, known as near-field diffraction, can become rather mathematically challenging, hence a simpler scenario known as Fraunhofer diffraction was employed instead, where the object is assumed to be very far from the aperture (ideally at ∞, shown in Fig. 1.1). An equivalent effect can be accomplished by use of a lens (Fig. 1.2), where rays that are diffracted at an angle θ are observed at distance x from the principal axis of the lens. Additionally, for small angles (in radians), we have that: θ ≈ x/f.

Figure 1: laser beam is diffracted. In (1), a far-field diffraction pattern is obtained from a very distant detector, whilst at (2), they meet in the focal plane of a lens. Source: 1 Adapted from Mangles et. al, 2021, “Year 1 Laboratory Manual: Diffraction Experiment”, Imperial College, London

#### Single Slit Diffraction

When considering a Fraunhofer diffraction pattern of a single slit, the intensity of light is found by the sum of the amplitudes of the electric field of light from each elementary point on the slit, following from Huygens’ Principle. Then, by squaring the amplitude pattern, the intensity distribution function, I (x), is obtained for a given slit width (a) as a function of displacement (x) in the observation plane from the central maximum peak:

(1.1) makes use of the small angle approximation, which gives that θ ≈ x/f. Additionally, a, x, λ and f all have dimensions of length, therefore must be expressed in identical units, which was chosen to be millimetres throughout this practical.

Solving (1.1), we obtain the zeros of intensity occur at the x-coordinates xm given by the following equation:

which rearranges to give the following:

Thus, the spacing of the minima can be used to obtain a.

#### Double Slit Interference

Geometry is used to derive the interference pattern that results from light passing through two idealised (infinitely narrow) slits. Given this, then we have that the difference between the two paths (S1P and S2P) from a distant detector is given by:

Figure 3: The geometry of double-slit interference. L >> 0, δ ≈ d·sin(θ) . Total light amplitude at any given point P on observation axis is the vector sum of amplitudes from both slits, accounting for phase difference. Source: 1

Thus, the positions of total constructive and destructive interference are given by maxima: d·sin(θ) = mλ, and minima: d·sin(θ) = (m+½)λ respectively, where m is the order number.

Yet, since observations are taken from the focal plane of a lens, substituting from Fig. 1.2, that sin(θ) ≈ θ ≈ x/f, we have that the position of bright and dark fringes are given by:

It follows that the spacing between successive maxima or minima is given by λf/d . Hence, given idealised slits (of negligible width), the intensity distribution of the double slit interference pattern for small angles (in radians) is given by:

When slits have a finite width a, and d is slit separation, we find that the intensity is equal to the product of a single slit distribution (1.1) and that of a double slit (2.4):

## III. Method

The practical was composed of two experiments - the first of which was concerned with determining physical dimensions of objects using diffraction, recording the position of each minimum, whilst the latter utilised a CMOS camera to investigate the diffraction patterns resulting from single and double slits.

In the first experiment, measurements were taken to determine the width of the single slit by noting the range in positions where the minima in the diffraction pattern occurred, which are related to a from (1.3). Similarly, fringe spacing was noted for the double slit to determine d from (2.3).

A red diode laser (λ = 670±1 nm) was used as the light source for these two experiments. Care was taken to ensure that the laser was handled in a safe conduct, being turned off when not in use, and ensuring that it was never pointed at other people.

Figure 4: Basic arrangement of apparatus for measuring the characteristics of diffraction patterns. Slit(s) are placed close to laser output, and the detector is at the focal plane of the lens. Source: 1

A photodiode was used as the detector in this case, to measure the intensity of the diffraction pattern. This was then connected to a multimeter to collect voltage readings: positions where the voltage was found to be at a local minimum corresponds to the position of minima, as photodiode voltage ∝ light intensity on the diode. Both slit and photodiode are attached to a precision translation stage, upon which the photodiode can be moved to measure the diffraction pattern intensities at varying positions from the lens. The translation slide has a total range of 25mm, whilst the stage has a range of approximately 1m.

An appropriately-chosen lens (f ≈ 500mm) was selected to give an optimally-sized diffraction pattern, such that the positions of the zeros could be measured using the diode and translation slide. The range over which this local minimum reading of voltage occurred over gave the uncertainty. Following this, the experiment was repeated for the double-slit slide.

Figure 5: A photograph depicting the experimental set-up for the practicals. The CMOS camera unit was substituted for the photodiode-multimeter unit.

In the second experiment, rather than taking manual readings using the micrometer on the translation slide, a CMOS detector was instead utilised. The correct lens was selected to fit the diffraction pattern onto the CMOS detector, and the distance of the camera was adjusted so that it was the correct distance from the lens. Using the ThorCam™ application on Windows™, we subsequently obtained an unsaturated image of the pattern, ensuring that exposure time was set short enough for this. The Horizontal Profile Plot tool was used to adjust the exposure time so that the peak of the central maxima was not cut off the chart. These images were then saved, imported into ImageJ and axes were aligned to a grid. The Rectangle tool was then used with the Plot Profile command in order to obtain numerical values of the horizontal profile as a .CSV, that was loaded into VSCode for data analysis with Python (Numpy, Matplotlib and Scipy).

## IV. Results, Uncertainties and Discussion

The following tables of results were obtained from the first experiment, which took manual micrometer measurements.

Table 1: The minima displacements (x) for various minima m, obtained through the single slit. All displacement values are given in millimetres.

Figure 6:
Minima plot from Table 1 Error bars in pink.

R2: 0.9988 gradient: 3.53±0.06 y-intercept: 0.41±0.11
a:(11.5±0.23)×10-2 mm

Table 2: The minima displacements (x) for various minima m, obtained through the double slit. All displacement values are given in millimetres.

Figure 7: Minima plot from Table 2 R2 = 0.9917 gradient: 1.16±0.04 y-intercept:
0.68±0.17
d:(2.88±0.43)×10-4 m
Anomalous data around n=0 is due to n=1 being preliminary readings.

For the second experiment, the resultant data was loaded into VSCode as a CSV file and a conversion factor2 was applied to convert pixels into metres, as well as account for imageJ.

In order to obtain the minima, the following numerical method was used in Python, by creating a np.linspace of values, and finding the minimum3 of the array. Additionally, a correction function was applied to the curve_fit to shift the curve.

The following plots were obtained:

Figure 8 (Left): The profile plot of all the points on the single slit intensity distribution curve (blue), with the curve fit from (1.3) (red). Minima were obtained from the curve fitted function (see Figure 9), Figure 9 (Right): The minima plot for the single slit taken with the CMOS camera. We find that, taking into account the covariance matrix of the curve_fit function adds further uncertainty4, resulting in the value: a = (1.151 ± 0.023)×10-4 m.

Figure 10 (Left): The profile plot of all the points on the double slit intensity distribution curve (blue), with the curve fit from (2.5) (red). Minima were obtained from the curve-fitted function (see Figure 11). Figure 11 (Right): The minima plot taken with the CMOS. Adding curve_fit function’s covariance matrix into the uncertainty4, as well as the polyfit, we have that: d = (4.64 ± 0.12)×10-4 m.

As can be seen from Figures 8 and 10, the plots of our data that we obtain very tightly follow the theoretical equations defined in (1.3) and (2.5) respectively. The minima plots obtained from both graphs are similarly linear as expected, and are alike their counterparts in Figures 6, 7.

## V. Conclusion

In summary, the following data was obtained from both experiments: for single slit, a = (9.49±6.48)×10-5 m manually, and a = (11.51±0.23)×10-5 m using the CMOS camera; for double slit d = (2.88±0.43)×10-4 m manually, and d = (4.64±0.12)×10-4 m using the CMOS camera. We find that they are both within the same order of magnitude with each other, which although they are each off by roughly 2×10-5 and 2×10-4 respectively. As a result, this demonstrates that the findings made manually are a good estimation of what we ascertained through the use of the CMOS camera.

To reduce uncertainties of the experiment, it would be repeated with lenses of different focal lengths several times using different wavelengths of light. A more precise CMOS camera could also be used, and by adjusting the lens, the diffraction pattern could be more spread out, to reduce the percentage uncertainty in readings. A darker setting would minimise background noise, and would reduce the need for the correction function to perform a shift downwards of the function to eliminate this systematic error from our results - although, in this instance, it had no effect due to the local minima being obtained from our curve_fit.

## VI. References, Footnotes

1 Mangles et. al. (2021), “Year 1 Laboratory Manual: Diffraction Experiment”, Imperial College, London, Adapted from Figures 1.1, 1.3, 1.5. Self-drawn sketches. https://bb.imperial.ac.uk/webapps/blackboard/execute/content/file?cmd=view&content_id=_2343237_1&course_id=_30279_1
2 CMOS Camera Specifications, Thor Labs, DCC1545M model, accessed on December 8, 2021 https://www.thorlabs.com/thorProduct.cfm?partNumber=DCC1545M. ImageJ scale factor obtained by converting from built in inches to a corrected, to-scale version of the data.
³ argelextrema function for calculating local minima, special thanks to Dani Weronski-Fauco for suggesting this function. Scipy Documentaton, accessed December 8, 2021
https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.argrelextrema.html
⁴ Uncertainties were propagated using the Python uncertainties library, instead of using complex nested square roots, which are more error-prone; uncertainties: by Eric O. LEBIGOT, https://pythonhosted.org/uncertainties/

Figures of which a source has not been quoted were created by myself. These include Figures 2, 5, 6, 7, 8, 9, 10 and 11. Figure 2 was created using the online graphing calculator, Desmos.
The source code used to conduct this experiment can be found at the following Github repository: https://github.com/martin-he543/diffraction-lab-report
