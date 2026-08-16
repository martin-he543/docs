# Determining the Maximum Electron Energy with Sr-90, Aluminium and Copper

```post-data
{
  "date": "2022-11-04",
  "tags": [
    "report",
    "university",
    "labs",
    "archived"
  ],
  "summary": "Completed in the Blackett Laboratory as part of Second Year Labs, in the first Radioactivity Lab Cycle."
}
```

**Abstract – Various hypotheses were proposed to relate superposed exponential fittings to the count rate of the electron emissions from Sr-90 through various thicknesses of Cu and Al metal sheets, as recorded digitally. By performing χ² minimisation tests on variations of these hypotheses, as well as least-squares linear regressions, we determined maximum electron energies consistent with our predictions. For the n = 3 hypothesis, this was found to be at (1.91±0.14) MeV and (1.13±0.15) MeV for Copper, and (2.12±0.35) MeV and (1.05±0.15) MeV for Aluminium, as compared to the actual values of 2.27MeV and 0.54MeV.**

## I. Introduction & Theory

Strontium-90 sources undergo two β- decays decays in succession, the decay schemes are displayed in Figure 1: treating the source as point-like, therefore its spread of emitted β particles is assumed to be spherical. Thus, we expect the count rate to fall roughly in accordance to an inverse-square law distribution, as well as an exponential decay relationship in accordance with Beer-Lambert’s law[1] with the addition of sheets of Al and Cu.

![strontium decay schemes](/assets/img/blog/strontium.png "Strontium Decay Schemes")

**Figure 1:** Left – the decay scheme for Sr-90. Right – the decay scheme for Am-241.

By minimising the distance (at approximately 5cm) between the detector and the Sr-90 source, we can mitigate for the effects of attenuation in air, treating it as an extended source.
From Figure 1[2], we are able to ascertain the different possible β emissions which we can detect. Thence, we are able to determine linear trends with different gradients for each emission. By taking the intercepts of the linear regressions, as well as their associated uncertainties, we are able to calculate the maximum electron energies, E_max, and compare to the theoretical values.

## II. Experimental Set-Up and Data Collection

By considering the absorption of β rays, which eventually will be absorbed after losing all their energy to matter, therefore increasing the thickness results in the number of electrons slowly approaching background intensity, which becomes dominated by the γ-component of emissions.  We have that the maximum energy, , is determined from the range R of electrons:

![electron range equation](/assets/img/equations/electron_range.png "Equation 1")

where R is given by ρd_max, and the maximum electron energy, E_max, which can be rearranged to give the maximum energy:

![maximum electron energy](/assets/img/equations/max_electron_energy.png "Equation 2")

In this scenario[3],  ρ_Al = (2.7±0.1) g.cm¯³,  ρ_Cu = (8.96± 0.5) g.cm¯³, at room temperature, and standard conditions.
The experimental set-up is simple: a detector is mounted onto a retort stand, with the Sr-90 source aligned above. This detector is connected with an oscilloscope, and in turn interfaced with a PC. In between the detector and the source, various sheets of Al and Cu are placed, and their thicknesses are measured with a vernier calliper, which are assumed to be constant. Using the SimpleCounter program, we record the count rate.

![figure_2](/assets/img/equations/schematic_strontium.png "Figure 2")

**Figure 2:** Experimental Schematic. Various sheets of Cu and Al are placed in between the Strontium source and the detector, which is in turn connected to a computer.

## III. Results & Analysis

Therefore, using the intersections of the linear regression lines, as well as their associated uncertainties, we can determine the values of R by multiplying by the density of Al and Cu. Thus, we can calculate the maximum electron energy.[4]

##### Copper (Cu)
R_min = (8.96 ± 0.03) × (0.55 ± 0.09) mm = (0.490 ± 0.081) g.cm¯²
R_max = (8.96 ± 0.03) × (0.99 ± 0.08) mm = (0.890 ± 0.072) g.cm¯²
E_max_l = (1.13 ± 0.15) MeV,     E_max_h = (1.91 ± 0.14) MeV

##### Aluminium (Al)
R_min = (2.70 ± 0.03) × (1.65 ± 0.17) mm = (0.165 ± 0.017) g.cm¯²
R_max = (2.70 ± 0.03) × (4.40 ± 0.66) mm = (0.371 ± 0.066) g.cm¯²
E_max_l = (1.05 ± 0.15) MeV,     E_max_h = (2.12 ± 0.35) MeV

**Table 1:** the resultant maximum electron energies for Cu and Al.

A Chi-Squared[5] minimisation algorithm for the n = 3 hypothesis, with the various intersection points calculated. Figures 3 and 4 show the range of polynomial fittings employed for Al and Cu, with the value of the minimum χ² value.[6]

![figure_3](/assets/img/equations/fig3_strontium.png "Figure 3")

**Figure 3:** The logarithmic count for the decay products of Sr-90 passing through varying thicknesses of Al sheets, χ² =  93.85, this is well inside the rejection region for ν = 12, with a p-value < .00001, so statistically significant.

![figure_4](/assets/img/equations/fig4_strontium.png "Figure 4")

**Figure 4:** A logarithmic count of the decay products of Sr-90 passing through varying thicknesses of Cu sheets, χ² =  104.61,this is well inside the rejection region for ν = 10, with a p-value <.00001, so statistically significant.

In comparison to the theoretical values of the energies, our maximum electron energy from the Aluminium is consistent with the theoretical value for the 2.27MeV electron, whilst it is a slight underestimate for Copper. Both low-energy electrons are overestimates, with the resultant electron energy almost equal to the sum of both 0.54MeV and 0.51MeV electrons.

### Chi-Squared Minimisation Algorithm

By performing an additional Chi Squared minimisation hypothesis test for n = 4 not shown here for including four linear regressions, it is shown that n = 3 is a superior fit. A series of nested for-loops combined with a Chi Squared function were utilised to determine the minimised p-value solution. Both result in p-values that are smaller than 0.0001, which is statistically significant. The algorithm, as applied to n = 3 is shown below in Figure 5, with the reduced Chi squared values against linear regression ranges, as well as intersection values by χ² values.

![figure_5](/assets/img/equations/fig5_strontium.png "Figure 5")

**Figure 5:** The Chi-Squared minimisation algorithm applied to various linear regression hypotheses, in order to determine the intersections, and thereby the values of R and maximum electron energies. They are organised by reduced Chi-Squared values (y-axis). The lowest Chi-squared value is used in all cases.

### Results of Chi-Squared Tests

We found the strongest value to be for n = 3 lines for the linear graph. Testing fittings for other distributions (inverse square law, etc.), there appears to be the strongest distribution for the following three linear regressions, as shown above.

## IV. Conclusion

We have produced a model for the variation in count rate over different thicknesses of Cu and Al. Both calculated electron maximum energies are of the same order of magnitude, and in proximity to the theoretical values, suggesting the theory behind our predictions are valid, with a high goodness of fit, as shown through the Chi-Squared minimisation algorithm.

We measured the maximum electron energies for Cu and Al to be (1.91±0.14) MeV and (1.13±0.15) MeV, and (2.12±0.35) MeV and (1.05±0.15) MeV, in comparison to the actual values of 2.27 MeV and 0.54 MeV. Our results the use of a 3-linear regression model, as opposed to a 4-linear regression fit, since we were unable to meaningfully detect the other β- (0.51 MeV) particle. Mutiple improvements could be made to this experiment to reduce the systematic and statistical errors.

Simulations could be performed using Geant4 and data collected would be compared to what was obtained experimentally. In order to automate the set-up, stepper motors could be mounted to control the distance of the detector from the source to calculate attenuation effects[7], as well as for varying the metal used (of different densities) and its thickness.[8]

## V. References

### Appendix I: Uncertainty Propagation
Throughout this practical, uncertainties were calculated in quadrature by using the Python uncertainties package. This eliminates the need for nested square roots, and the possibility for accidental errors, by using the ufloat type.

### Appendix II: Chi-Squared Testing
A Chi-squared minimisation algorithm was utilised in order to find the fitting with the most probable likelihood of being a good fit (i.e. minimising the p-value). The results of which can be found at the GitHub repository listed below for all the different permutations of linear regressions.
A similar test was performed on the n=4 hypothesis to determine if four linear regressions were better than three. All figures were created using Matplotlib in Python.

### References
##### martin-he543, GitHub
martinhe.com/radioactivity
All the data, as well as figures, uncertainty propagation and Python code can be found on the following GitHub repository, which was needed for the calculation of all the following findings.

____________________________________

[1] Granite, S.by (2021) Beer Lambert law: Transmittance & Absorbance, Edinburgh Instruments. Available at: https://www.edinst.com/blog/the-beer-lambert-law/#:~:text=The%20Beer%2DLambert%20law%20states,calculated%20by%20measuring%20its%20absorbance. (Accessed: November 9, 2022).

[2] Blackboard, V. (no date) Second Year Radioactivity Lab, Imperial Second Year BB. Available at: https://bb.imperial.ac.uk/webapps/blackboard/execute/content/file?cmd=view&content_id=_2526826_1&course_id=_33949_1 (Accessed: November 9, 2022).

[3] Reference tables (2020) NIST. Available at: 	https://www.nist.gov/ncnr/sample-environment/sample-	mounting/reference-tables (Accessed: November 9, 	2022).

[4] Welcome to the uncertainties package¶ (no date) Welcome to the uncertainties package - uncertainties Python package 3.0.1 documentation. Available at: https://pythonhosted.org/uncertainties/ (Accessed: November 9, 2022).

[5] 8. the chi squared tests: The BMJ (2021) The BMJ | The BMJ: leading general medical journal. Research. Education. Comment. Available at: https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/8-chi-squared-tests (Accessed: November 9, 2022).

[6] martin-he543 (no date) Martin-HE543/second-year-radioactivity: Data analysis for second year radioactivity lab cycle at Imperial College, London, as part of the BSC physics degree., GitHub. Available at: https://github.com/martin-he543/second-year-radioactivity (Accessed: November 9, 2022).

[7] Attenuation of Radiation in Air (no date) Lab 9: Attenuation of radiation. Available at: http://electron6.phys.utk.edu/phys250/Laboratories/attenuation_of_radiation.htm (Accessed: November 9, 2022).

[8] Chapter 1 Basic Radiation Physics - University of Arizona (no date). Available at: http://atlas.physics.arizona.edu/~shupe/Physics_Courses/Phys_586_S2015_S2016_S2017/Readings/00_MoreReadingBasicRadPhys.pdf (Accessed: November 9, 2022).
