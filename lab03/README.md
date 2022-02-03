# Lab 03 Questions

### 1) How would you add another class to your choropleth map?

In order to add another class to the choropleth map, you would have to go into the getColor class and add another line depending on what the values of the new class you would want. For example, if you wanted an additional class for the values between 50,000,000 and 100,000,000, you would add `value > 100000000 ? #(whatever color):`. Assuming you have a class where the max value of 50,000,000 already, this would create a new class for the values between 50,000,000 and 100,000,000 and also a class for values higher than 100,000,000.

### 2) How would you add another class to your legend?

In order to add another class to the legend, you would need to go to where the legend is added and customize the breaks within the `grades` array. Following my example previously, if you wanted to add the class to the legend you would change the breaks in `grades` so that 100,000,000 is in the `grades` array.

```
grades = [0, 5000000, 10000000, 25000000, 50000000, 100000000];
```

This would add an additonal class for the values between 50,000,000 and 100,000,000 and then also a class for values higher than 100,000,000 into the legend.

### 3) How might you create a map where all map layers are toggled OFF by default? Why might this be a useful option?

In order to create the map where all the map layers are toggled off initially, you would simply remove the `addTo(map)` function from after the layers are initialized. This would leave them toggled off initially, but still allow them to be toggled on by the control if wanted. 

This could be useful for a story map, where you might want to build upon and slowly add layers over time to allow the viewer to see the changes. It can also allow your viewers to get adjusted to the basemap and the location which is being studied and then as you add layers it emphasizes what you are trying to show the viewer.
