speed = csvread('speed.csv');
speedInt = interp1([1:1:size(speed)],speed, linspace(1,size(speed,1), size(brake,1))).';
speed300 = speedInt(1400:1700);
speed300OS = (speed300<=85);

brake = csvread('brake.csv');
brake = brake .* (brake < 300);
brake = padarray(brake, [1], 'post');
brake300 = brake(1400:1700);

dist300Cum=cumsum((dist300-dist300(1)).*(brake300.'>0))./cumsum(dist300);



fuel = csvread('fuelcons.csv');
fuel = fuel .* (fuel<1e6);
fuelcons = fuel - fuel(1);
fuelcons = fuelcons .* (fuelcons >0);
for i=[2:size(fuelcons)]
    if fuelcons(i)==0
        fuelcons(i) = fuelcons(i-1);
    end
end
fuelconsInt = interp1([1:1:size(fuelcons)],fuelcons, linspace(1,size(fuelcons,1), size(brake,1))).';

fuelconsIntkm =zeros(size(brake,1),1);
for i=[2:size(fuelconsInt,1)]
    if (distInt(i)-distInt(i-1)) >0
        fuelconsIntkm(i) = (fuelconsInt(i)-fuelconsInt(i-1))/(distInt(i)-distInt(i-1));
    end
end
fuelconsIntkm = fuelconsIntkm .* (fuelconsIntkm<1e6);


dist = csvread('distance.csv');
dist = dist .* (dist < 1e7);
dist(1)=4;

for i=[2:size(dist)]
    if dist(i)==0
        dist(i) = dist(i-1);
    end
end
distInt = interp1([1:1:size(dist)],dist, linspace(1,size(dist,1), size(brake,1))).';
distInt =[0:0.02:0.02*size(brake,1)];
distInt = distInt(1:end-1);

dist300 = distInt(1400:1700);


cc = csvread('ccactive.csv');
cc = cc .* (cc <=1);
cc = padarray(cc, 514/2);
cc300 = cc(1400:1700);


weight = csvread('weight.csv');
weight = weight .* (weight<1e5);
for i=[2:size(weight)]
    if weight(i)==0
        weight(i) = weight(i-1);
    end
end
weightmean = mean(weight);

longitude = csvread('longitude.csv');
latitude = csvread('latitude.csv');

longitudeInt=interp1([1:1:size(longitude)],longitude, linspace(1,size(longitude,1), size(brake,1)));
latitudeInt=interp1([1:1:size(latitude)],latitude, linspace(1,size(latitude,1), size(brake,1)));

long300 = longitudeInt(1400:1700);
lat300 = latitudeInt(1400:1700);

altitude = csvread('altitude.csv');
altitudeInt=interp1([1:1:size(altitude)],altitude, linspace(1,size(altitude,1), size(brake,1)));

alt300 = altitudeInt(1400:1700);